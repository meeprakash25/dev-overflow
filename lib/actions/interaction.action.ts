import Interaction, { IInteractionDoc } from "@/app/(root)/database/interaction.model"
import handleError from "../handlers/error"
import { CreateInteractionSchema } from "../validations"
import action from "../handlers/action"
import mongoose from "mongoose"
import { REPUTATION_POINTS } from "@/constants"
import User from "@/app/(root)/database/user.model"

export async function createInteraction(params: CreateInteractionParams): Promise<ActionResponse<IInteractionDoc>> {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }

  const {
    action: actionType,
    actionId,
    actionTarget,
    authorId, // person who owns the content (question/answer)
  } = validationResult.params!
  const userId = validationResult.session?.user?.id

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const interaction = await createInteractionInTransaction(
      { action: actionType, actionId, actionTarget, authorId },
      session,
      userId!,
    )

    await session.commitTransaction()

    return { success: true, data: JSON.parse(JSON.stringify(interaction)) }
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction()
    return handleError(error) as ErrorResponse
  } finally {
    await session.endSession()
  }
}

export async function createInteractionInTransaction(
  params: CreateInteractionParams,
  session: mongoose.ClientSession,
  performerId: string,
): Promise<IInteractionDoc> {
  const { action: actionType, actionId, actionTarget, authorId } = params
  const [interaction] = await Interaction.create(
    [
      {
        user: performerId,
        action: actionType,
        actionId,
        actionType: actionTarget,
      },
    ],
    { session },
  )

  await updateReputation({ interaction, session, performerId, authorId })
  return interaction
}

async function updateReputation(params: UpdateReputationParams) {
  const { interaction, session, performerId, authorId } = params
  const { action, actionType } = interaction

  let performerPoints = 0
  let authorPoints = 0

  switch (action) {
    case "upvote":
      performerPoints = REPUTATION_POINTS.upvote.performer
      authorPoints = REPUTATION_POINTS.upvote.author
      break
    case "downvote":
      performerPoints = REPUTATION_POINTS.downvote.performer
      authorPoints = REPUTATION_POINTS.downvote.author
      break
    case "post":
      authorPoints = actionType === "question"
        ? REPUTATION_POINTS.post.question
        : REPUTATION_POINTS.post.answer
      break
    case "delete":
      authorPoints = actionType === "question"
        ? REPUTATION_POINTS.delete.question
        : REPUTATION_POINTS.delete.answer
      break
  }

  if (performerId === authorId) {
    await User.findByIdAndUpdate(performerId, { $inc: { reputation: authorPoints } }, { session })
    return
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: performerId },
          update: { $inc: { reputation: performerPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
    ],
    { session },
  )
}

