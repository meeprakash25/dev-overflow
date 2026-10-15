"use server"

import Question from "@/app/(root)/database/question.model"
import Vote from "@/app/(root)/database/vote.model"
import action from "../handlers/action"
import handleError from "../handlers/error"
import { AnswerServerSchema, DeleteAnswerSchema, GetAnswersSchema } from "../validations"
import mongoose from "mongoose"
import Answer, { IAnswerDoc } from "@/app/(root)/database/answer.model"
import ROUTES from "@/constants/routes"
import { revalidatePath } from "next/cache"
import { defaultPageSize } from "@/constants"
import { createInteractionInTransaction, updateReputationInTransaction } from "./interaction.action"
import Interaction from "@/app/(root)/database/interaction.model"

export async function createAnswer(params: CreateAnswerParams): Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { content, questionId } = validationResult.params!
  const userId = validationResult.session?.user?.id!

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const question = await Question.findById(questionId).session(session)
    if (!question) throw new Error("Question not found")

    const [newAnswer] = await Answer.create(
      [
        {
          content,
          question: questionId,
          author: userId,
        },
      ],
      { session },
    )

    if (!newAnswer) throw new Error("Failed to create answer")

    question.answers += 1
    await question.save({ session })

    const authorId = question.author._id.toString()

    if (userId !== authorId) {
      await createInteractionInTransaction(
        {
          action: "post",
          actionId: question._id.toString(),
          authorId: authorId,
          actionTarget: "answer",
        },
        session,
        userId,
      )
    }

    await session.commitTransaction()

    revalidatePath(ROUTES.QUESTION(questionId))

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) }
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction()
    return handleError(error) as ErrorResponse
  } finally {
    await session.endSession()
  }
}

export async function getAnswers(
  params: GetAnswersParams,
): Promise<ActionResponse<{ answers: Answer[]; isNext: boolean; totalAnswers: number }>> {
  const validationResult = await action({
    params,
    schema: GetAnswersSchema,
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { questionId, page = 1, pageSize = defaultPageSize, filter = "newest" } = validationResult.params!
  const skip = Number(page - 1) * pageSize
  const limit = pageSize

  let sortCriteria = {}

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 }
      break
    case "oldest":
      sortCriteria = { createdAt: 1 }
      break
    case "popular":
      sortCriteria = { upvotes: -1 }
      break
    default:
      sortCriteria = { createdAt: -1 }
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId })
    const answers = await Answer.find({ question: questionId })
      .populate({ path: "author", model: "User", select: "_id name image" })
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)

    const isNext = totalAnswers > skip + answers.length

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

export async function deleteAnswer(params: DeleteAnswerParams): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true, // only authorized user can delete answer
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const loggedInUser = validationResult?.session?.user

  const { answerId } = validationResult.params!

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const answer = await Answer.findById(answerId).session(session)
    if (!answer) {
      throw new Error("Answer not found")
    }

    if (answer.author._id.toString() !== loggedInUser?.id) {
      throw new Error("Cannot delete this answer, not authorized")
    }

    await answer.deleteOne().session(session)

    await Vote.deleteMany({ targetType: "answer", targetId: answerId }).session(session)

    await Question.findByIdAndUpdate(answer.question, { $inc: { answers: -1 } }).session(session)

    await Interaction.deleteMany({ actionType: "answer", actionId: answerId }).session(session)


    await updateReputationInTransaction({
      action: "delete",
      authorId: answer.author._id.toString(),
      actionTarget: "answer",
      session,
    })

    await session.commitTransaction()

    revalidatePath(ROUTES.PROFILE(loggedInUser?.id))

    return { success: true }
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction()
    return handleError(error) as ErrorResponse
  } finally {
    await session.endSession()
  }
}