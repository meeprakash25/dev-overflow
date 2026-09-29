"use server"

import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema } from "../validations"
import action from "../handlers/action"
import handleError from "../handlers/error"
import mongoose from "mongoose"
import Question from "@/app/(root)/database/question.model"
import Tag from "@/app/(root)/database/tag.model"
import type { ITag, ITagDoc } from "@/app/(root)/database/tag.model"
import TagQuestion from "@/app/(root)/database/tag-question.model"

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
        { upsert: true, new: true, session },
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

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<Question>> {
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

    const tagsToRemove = question.tags.filter((tag) => !tags.includes(tag.name.toLowerCase()))

    const newTagQuestionDocuments = []
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${escapedTag}$`, "i") } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session },
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

      question.tags = question.tags.filter((tag) => !tagsToRemove.includes(tag))
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

  const { questionId } = params

  try {
    const question = await Question.findById(questionId).populate("tags")
    if (!question) {
      throw new Error("Question not found")
    }

    return { success: true, data: JSON.parse(JSON.stringify(question)) }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}