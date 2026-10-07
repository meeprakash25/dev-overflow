"use server"

import Vote from "@/app/(root)/database/vote.model"
import action from "../handlers/action"
import handleError from "../handlers/error"
import { CreateVoteSchema, HasVotedSchema, UpdateVoteCountSchema } from "../validations"
import mongoose, { ClientSession } from "mongoose"
import Question from "@/app/(root)/database/question.model"
import Answer from "@/app/(root)/database/answer.model"
import { revalidatePath } from "next/cache"
import ROUTES from "@/constants/routes"

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
      } else {
        // if the user has already voted with a different voteType, update the vote
        await Vote.findByIdAndUpdate(existingVote._id, { voteType }, { new: true, session })
        await updateVoteCount({ targetId, targetType, voteType: existingVote.voteType, change: -1 }, session)
        await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session)
      }
    } else {
      // if the user has not voted yet, create a new vote
      await Vote.create([{ author: userId, targetId, targetType, voteType }], { session })
      await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session)
    }

    await session.commitTransaction()

    revalidatePath(ROUTES.QUESTION(targetId))
    return { success: true }
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
