import Interaction, { IInteractionDoc } from "@/app/(root)/database/interaction.model"
import handleError from "../handlers/error"
import { CreateInteractionSchema } from "../validations"
import action from "../handlers/action"
import mongoose from "mongoose"
import { REPUTATION_POINTS } from "@/constants"
import User from "@/app/(root)/database/user.model"
import { auth } from "@/auth"

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

  const authSession = await auth()
  if (!authSession) throw new Error("Only logged-in user can use this feature.")

  // const authUserId = authSession?.user?.id
  
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

  await updateReputationInTransaction({ action: actionType, actionTarget, session, authorId })
  return interaction
}

export async function updateReputationInTransaction(params: UpdateReputationParams): Promise<void> {
  const authSession = await auth()
  if (!authSession) throw new Error("Only logged-in user can use this feature.")

  const { action, actionTarget, session, authorId } = params

  const performerId = authSession?.user?.id

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
      authorPoints = actionTarget === "question" ? REPUTATION_POINTS.post.question : REPUTATION_POINTS.post.answer
      break
    case "delete":
      authorPoints = actionTarget === "question" ? REPUTATION_POINTS.delete.question : REPUTATION_POINTS.delete.answer
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
