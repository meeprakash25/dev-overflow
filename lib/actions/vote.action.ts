"use server"

import Vote from "@/app/(root)/database/vote.model"
import action from "../handlers/action"
import handleError from "../handlers/error"
import { CreateVoteSchema, HasVotedSchema, UpdateVoteCountSchema } from "../validations"
import mongoose, { ClientSession } from "mongoose"
import Question, { IQuestion, IQuestionDoc } from "@/app/(root)/database/question.model"
import Answer, { IAnswerDoc } from "@/app/(root)/database/answer.model"
import { revalidatePath } from "next/cache"
import ROUTES from "@/constants/routes"
import {
  createInteractionInTransaction,
  deleteInteractionInTransaction,
  updateInteractionInTransaction,
} from "./interaction.action"

async function updateVoteCount(params: UpdateVoteCountParams, session: ClientSession): Promise<void> {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
    authorize: true,
  })

  if (validationResult instanceof Error) {
    throw validationResult
  }

  const { targetId, targetType, voteType, change } = validationResult.params!

  const voteField = voteType === "upvote" ? "upvotes" : "downvotes"

  const update = { $inc: { [voteField]: change } }
  const result =
    targetType === "question" ?
      await Question.findByIdAndUpdate(targetId, update, { new: true, session })
    : await Answer.findByIdAndUpdate(targetId, update, { new: true, session })

  if (!result) throw new Error("Failed to update vote count")
}

export async function createVote(params: CreateVoteParams): Promise<ActionResponse> {

  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { targetId, targetType, voteType } = validationResult.params!

  const userId = validationResult.session?.user?.id

  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    let question = undefined, answerAuthorId = undefined
    if (targetType === "question") question = (await Question.findById(targetId).session(session)) as IQuestionDoc
    else {
      const answer = (await Answer.findById(targetId).select("_id author question").session(session)) as IAnswerDoc
      question = (await Question.findById(answer.question).select("_id author").session(session)) as IQuestionDoc
      answerAuthorId = answer.author.toString()
    }

    if (!question) {
      throw new Error(`Question not found.`)
    }

    const questionAuthorId = question.author.toString()

    const existingVote = await Vote.findOne({
      author: userId,
      targetId,
      targetType,
    }).session(session)

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // if the user has already voted with the same voteType, remove the vote
        await Vote.deleteOne({ _id: existingVote._id }).session(session)
        await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session)

        // if (userId !== targetAuthorId) {
        await deleteInteractionInTransaction(
          {
            action: voteType,
            actionId: targetId,
            questionAuthorId: questionAuthorId,
            answerAuthorId: answerAuthorId,
            actionTarget: targetType,
          },
          session,
        )
        // }
      } else {
        // if the user has already voted with a different voteType, update the vote
        await Vote.findByIdAndUpdate(existingVote._id, { voteType }, { new: true, session })
        await updateVoteCount({ targetId, targetType, voteType: existingVote.voteType, change: -1 }, session)
        await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session)

        // if (userId !== targetAuthorId) {
        await updateInteractionInTransaction(
          {
            action: voteType,
            actionId: targetId,
            questionAuthorId: questionAuthorId,
            answerAuthorId: answerAuthorId,
            actionTarget: targetType,
          },
          session,
        )
        // }
      }
    } else {
      // if the user has not voted yet, create a new vote
      await Vote.create([{ author: userId, targetId, targetType, voteType }], { session })
      await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session)

      // if (userId !== targetAuthorId) {
      await createInteractionInTransaction(
        {
          action: voteType,
          actionId: targetId,
          questionAuthorId: questionAuthorId,
          answerAuthorId: answerAuthorId,
          actionTarget: targetType,
        },
        session,
      )
      // }
    }

    await session.commitTransaction()

    revalidatePath(ROUTES.QUESTION(targetId))
    return { success: true }
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction()
    return handleError(error) as ErrorResponse
  } finally {
    await session.endSession()
  }
}

export async function hasVoted(
  params: HasVotedParams
): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { targetId, targetType } = validationResult.params!
  const userId = validationResult.session?.user?.id

  try {
    const vote = await Vote.findOne({
      author: userId,
      targetId,
      targetType
    })

    if (!vote) {
      return {
        success: false,
        data: {hasUpvoted: false, hasDownvoted: false}
      }
    }

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote"
      }
    }

  } catch (error) {
    return handleError(error) as ErrorResponse
  }

  
}
