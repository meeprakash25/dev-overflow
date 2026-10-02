"use server"

import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validations"
import action from "../handlers/action"
import handleError from "../handlers/error"
import mongoose, { type QueryFilter } from "mongoose"
import Question, { IQuestionDoc } from "@/app/(root)/database/question.model"
import Tag from "@/app/(root)/database/tag.model"
import User from "@/app/(root)/database/user.model"
import type { ITagDoc } from "@/app/(root)/database/tag.model"
import TagQuestion from "@/app/(root)/database/tag-question.model"
import { defaultPageSize } from "@/constants"
import ROUTES from "@/constants/routes"
import { revalidatePath } from "next/cache"

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true, // only authorized user can create question
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { title, content, tags } = params
  const userId = validationResult?.session?.user?.id

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const [question] = await Question.create([{ title, content, author: userId }], { session })
    if (!question) {
      throw new Error("Failed to create question")
    }

    const tagIds: mongoose.Types.ObjectId[] = []
    const tagQuestionDocuments = []
    for (const tag of tags) {
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${escapedTag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, returnDocument: "after", session },
      )

      tagIds.push(existingTag._id)
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      })
    }
    await TagQuestion.insertMany(tagQuestionDocuments, { session })

    await Question.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagIds } } }, { session })

    await session.commitTransaction()

    return { success: true, data: JSON.parse(JSON.stringify(question)) }
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction()
    return handleError(error) as ErrorResponse
  } finally {
    session.endSession()
  }
}

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<IQuestionDoc>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true, // only authorized user can create question
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { title, content, tags, questionId } = params
  const userId = validationResult?.session?.user?.id

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const question = await Question.findById(questionId).populate<{ tags: ITagDoc[] }>("tags")
    if (!question) {
      throw new Error("Question not found")
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized")
    }

    if (question.title !== title || question.content !== content) {
      question.title = title
      question.content = content
      await question.save({ session })
    }

    const tagsToAdd = tags.filter(
      (tag) => !question.tags.some((existingTag) => existingTag.name.toLowerCase() === tag.toLowerCase()),
    )

    const tagsToRemove = question.tags.filter((tag) => !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase()))

    const newTagQuestionDocuments = []
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${escapedTag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, returnDocument: "after", session },
        )

        if (existingTag) {
          newTagQuestionDocuments.push({
            tag: existingTag._id,
            question: question._id,
          })
          question.tags.push(existingTag)
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag) => tag._id)
      await Tag.updateMany({ _id: { $in: tagIdsToRemove } }, { $inc: { questions: -1 } }, { session })
      await TagQuestion.deleteMany({ tag: { $in: tagIdsToRemove }, question: questionId }, { session })

      question.tags = question.tags.filter((tag) => !tagIdsToRemove.some((id) => id.equals(tag._id)))
    }

    if (newTagQuestionDocuments) await TagQuestion.insertMany(newTagQuestionDocuments, { session })

    await question.save()

    await session.commitTransaction()

    return { success: true, data: JSON.parse(JSON.stringify(question)) }
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction()
    return handleError(error) as ErrorResponse
  } finally {
    session.endSession()
  }
}

export async function getQuestion(params: GetQuestionParams): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true, // only authorized user can view question
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { questionId } = validationResult.params!

  try {
    const question = await Question.findById(questionId)
      .populate("tags", "name")
      .populate({ path: "author", model: User, select: "_id, name image" })
    if (!question) {
      throw new Error("Question not found")
    }

    return { success: true, data: JSON.parse(JSON.stringify(question)) }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

export async function getQuestions(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { page = 1, pageSize = defaultPageSize, query, filter } = params
  const skip = (Number(page) - 1) * pageSize
  const limit = Number(pageSize)

  const filterQuery: QueryFilter<typeof Question> = {}

  if (filter === "recommended") return { success: true, data: { questions: [], isNext: false } }

  if (query) {
    filterQuery.$or = [{ title: { $regex: new RegExp(query, "i") } }, { content: { $regex: new RegExp(query, "i") } }]
  }

  let sortCriteria = {}

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 }
      break
    case "unanswered":
      filterQuery.answers = 0
      sortCriteria = { createdAt: -1 }
      break
    case "popular":
      sortCriteria = { upvotes: -1 }
      break
    default:
      sortCriteria = { createdAt: -1 }
      break
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery)
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate({ path: "author", model: User, select: "name image" })
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
    const isNext = totalQuestions > skip + questions.length

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

export async function incrementViews(params: IncrementViewsParams): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncrementViewsSchema,
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { questionId } = validationResult.params!

  try {
    const question = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { returnDocument: "after", select: "views" },
    )

    if (!question) {
      throw new Error("Question not found")
    }

    return { success: true, data: { views: question.views } }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}