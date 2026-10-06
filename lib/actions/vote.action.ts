"use server"

import Vote from "@/app/(root)/database/vote.model"
import action from "../handlers/action"
import handleError from "../handlers/error"
import { CreateVoteSchema, HasVotedSchema, UpdateVoteCountSchema } from "../validations"
import mongoose, { ClientSession } from "mongoose"
import { z } from "zod"
import Question from "@/app/(root)/database/question.model"
import Answer from "@/app/(root)/database/answer.model"

async function updateVoteCount(params: UpdateVoteCountParams, session: ClientSession): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
    authorize: true,
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const { targetId, targetType, voteType, change } = validationResult.params!

  const voteField = voteType === "upvote" ? "upvotes" : "downvotes"

  try {
    const update = { $inc: { [voteField]: change } }
    const result =
      targetType === "question" ?
        await Question.findByIdAndUpdate(targetId, update, { new: true, session })
      : await Answer.findByIdAndUpdate(targetId, update, { new: true, session })

    if (!result) {
      return handleError("Failed to update vote count") as ErrorResponse
    }

    return { success: true }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
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

  if (!userId) handleError(new Error("Unauthorized")) as ErrorResponse

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const existingVote = await Vote.findOne({
      authorId: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session)

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // if the user has already voted with the same voteType, remove the vote
        await Vote.deleteOne({ _id: existingVote._id }).session(session)
        await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session)
      } else {
        // if the user has already voted with a different voteType, update the vote
        await Vote.findByIdAndUpdate(existingVote._id, { voteType }, { new: true, session })
        await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session)
      }
    } else {
      // if the user has not voted yet, create a new vote
      await Vote.create({ actionId: targetId, targetType, voteType, change: 1 }, session)
      await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session)
    }
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction()
    return handleError(error) as ErrorResponse
  } finally {
    session.endSession()
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
      actionId: targetId,
      actionType: targetType
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
