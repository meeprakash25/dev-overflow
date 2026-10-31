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
    questionAuthorId, // person who owns the content question
    answerAuthorId, // person who owns the content answer
  } = validationResult.params!
  // const userId = validationResult.session?.user?.id!
  // const performerId = userId

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const interaction = await createInteractionInTransaction(
      { action: actionType, actionId, actionTarget, questionAuthorId, answerAuthorId },
      session,
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
): Promise<IInteractionDoc> {

  const authSession = await auth()
  if (!authSession) throw new Error("Only logged-in user can use this feature.")

  const authUserId = authSession?.user?.id
  const performerId = authUserId
  
  const { action: actionType, actionId, actionTarget, questionAuthorId, answerAuthorId } = params

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

  await updateReputationInTransaction({ action: actionType, actionTarget, session, questionAuthorId, answerAuthorId })
  return interaction
}

export async function updateReputationInTransaction(params: UpdateReputationParams): Promise<void> {
  const authSession = await auth()
  if (!authSession) throw new Error("Only logged-in user can use this feature.")

  const { action, actionTarget, session, questionAuthorId, answerAuthorId } = params

  const performerId = authSession.user?.id
  if (!performerId) throw new Error("Only logged-in user can use this feature.")

  let performerPoints = 0
  let questionAuthorPoints = 0
  let answerAuthorPoints = 0

  switch (action) {
    case "upvote":
      if (actionTarget === "question") {
        performerPoints = REPUTATION_POINTS.upvote.question.performer
        questionAuthorPoints = REPUTATION_POINTS.upvote.question.author
      } else if (actionTarget === "answer") {
        performerPoints = REPUTATION_POINTS.upvote.answer.performer
        questionAuthorPoints = REPUTATION_POINTS.upvote.answer.question_author
        answerAuthorPoints = REPUTATION_POINTS.upvote.answer.answer_author
      }
      break
    case "downvote":
      if (actionTarget === "question") {
        performerPoints = REPUTATION_POINTS.downvote.question.performer
        questionAuthorPoints = REPUTATION_POINTS.downvote.question.author
      } else if (actionTarget === "answer") {
        performerPoints = REPUTATION_POINTS.downvote.answer.performer
        questionAuthorPoints = REPUTATION_POINTS.downvote.answer.question_author
        answerAuthorPoints = REPUTATION_POINTS.downvote.answer.answer_author
      }
      break
    case "post":
      questionAuthorPoints =
        actionTarget === "question" ? REPUTATION_POINTS.post.question : REPUTATION_POINTS.post.answer
      break
    case "delete":
      questionAuthorPoints =
        actionTarget === "question" ? REPUTATION_POINTS.delete.question : REPUTATION_POINTS.delete.answer
      break
  }

  await writeToDatabase({
    performerId,
    questionAuthorId,
    answerAuthorId,
    performerPoints,
    questionAuthorPoints,
    answerAuthorPoints,
    action,
    actionTarget,
    session,
  })
}

export async function updateInteractionInTransaction(
  params: UpdateInteractionParams,
  session: mongoose.ClientSession,
): Promise<IInteractionDoc> {
  const authSession = await auth()
  if (!authSession) throw new Error("Only logged-in user can use this feature.")

  const authUserId = authSession.user?.id
  if (!authUserId) throw new Error("Only logged-in user can use this feature.")
  const performerId = authUserId

  const { action: actionType, actionId, actionTarget, questionAuthorId, answerAuthorId } = params

  const interaction = await Interaction.findOne({
    user: authUserId,
    actionId: actionId,
    actionType: actionTarget,
    action: { $in: ["upvote", "downvote"] },
  }).session(session)

  if (!interaction) {
    throw new Error("Cannot find interaction")
  }

  interaction.action = actionType
  await interaction.save({ session })

  let performerPoints = 0
  let questionAuthorPoints = 0
  let answerAuthorPoints = 0
  if (actionType === "upvote") {
    if (actionTarget === "question") {
      performerPoints = -REPUTATION_POINTS.downvote.question.performer + REPUTATION_POINTS.upvote.question.performer
      questionAuthorPoints = -REPUTATION_POINTS.downvote.question.author + REPUTATION_POINTS.upvote.question.author
    } else if (actionTarget === "answer") {
      performerPoints = -REPUTATION_POINTS.downvote.answer.performer + REPUTATION_POINTS.upvote.answer.performer
      questionAuthorPoints =
        -REPUTATION_POINTS.downvote.answer.question_author + REPUTATION_POINTS.upvote.answer.question_author
      answerAuthorPoints =
        -REPUTATION_POINTS.downvote.answer.answer_author + REPUTATION_POINTS.upvote.answer.answer_author
    }
  } else if (actionType === "downvote") {
    if (actionTarget === "question") {
      performerPoints = -REPUTATION_POINTS.upvote.question.performer + REPUTATION_POINTS.downvote.question.performer
      questionAuthorPoints = -REPUTATION_POINTS.upvote.question.author + REPUTATION_POINTS.downvote.question.author
    } else if (actionTarget === "answer") {
      performerPoints = -REPUTATION_POINTS.upvote.answer.performer + REPUTATION_POINTS.downvote.answer.performer
      questionAuthorPoints =
        -REPUTATION_POINTS.upvote.answer.question_author + REPUTATION_POINTS.downvote.answer.question_author
      answerAuthorPoints =
        -REPUTATION_POINTS.upvote.answer.answer_author + REPUTATION_POINTS.downvote.answer.answer_author
    }
  }

  await writeToDatabase({
    performerId,
    questionAuthorId,
    answerAuthorId,
    performerPoints,
    questionAuthorPoints,
    answerAuthorPoints,
    action: actionType,
    actionTarget,
    session,
  })

  return interaction
}

export async function deleteInteractionInTransaction(
  params: DeleteInteractionParams,
  session: mongoose.ClientSession,
): Promise<boolean> {
  const authSession = await auth()
  if (!authSession) throw new Error("Only logged-in user can use this feature.")

  const authUserId = authSession.user?.id
  if (!authUserId) throw new Error("Only logged-in user can use this feature.")
  const performerId = authUserId

  const { action: actionType, actionId, actionTarget, questionAuthorId, answerAuthorId } = params

  const interaction = await Interaction.findOneAndDelete({
    user: authUserId,
    actionId: actionId,
    actionType: actionTarget,
  }).session(session)

  if (!interaction) {
    throw new Error("Cannot remove interaction")
  }

  let performerPoints = 0
  let questionAuthorPoints = 0
  let answerAuthorPoints = 0
  if (actionType === "upvote") {
    if (actionTarget === "question") {
      performerPoints = -REPUTATION_POINTS.upvote.question.performer
      questionAuthorPoints = -REPUTATION_POINTS.upvote.question.author
    } else if (actionTarget === "answer") {
      performerPoints = -REPUTATION_POINTS.upvote.answer.performer
      questionAuthorPoints = -REPUTATION_POINTS.upvote.answer.question_author
      answerAuthorPoints = -REPUTATION_POINTS.upvote.answer.answer_author
    }
  } else if (actionType === "downvote") {
    if (actionTarget === "question") {
      performerPoints = -REPUTATION_POINTS.downvote.question.performer
      questionAuthorPoints = -REPUTATION_POINTS.downvote.question.author
    } else if (actionTarget === "answer") {
      performerPoints = -REPUTATION_POINTS.downvote.answer.performer
      questionAuthorPoints = -REPUTATION_POINTS.downvote.answer.question_author
      answerAuthorPoints = -REPUTATION_POINTS.downvote.answer.answer_author
    }
  }

  await writeToDatabase({
    performerId,
    questionAuthorId,
    answerAuthorId,
    performerPoints,
    questionAuthorPoints,
    answerAuthorPoints,
    action: actionType,
    actionTarget,
    session,
  })

  return true
}

async function writeToDatabase({
  performerId,
  questionAuthorId,
  answerAuthorId,
  performerPoints,
  questionAuthorPoints,
  answerAuthorPoints,
  action,
  actionTarget,
  session,
}: {
  performerId: string
  questionAuthorId: string
  answerAuthorId?: string
  performerPoints: number
  questionAuthorPoints: number
  answerAuthorPoints?: number
  action?: "view" | "upvote" | "downvote" | "bookmark" | "post" | "edit" | "delete" | "search"
  actionTarget?: "question" | "answer"
  session: mongoose.ClientSession
}): Promise<void> {
  if (
    action &&
    (action === "post" || action === "delete" || action === "upvote" || action === "downvote") &&
    ((performerId === questionAuthorId)||(performerId === answerAuthorId))
  ) {
    // await User.findByIdAndUpdate(performerId, { $inc: { reputation: questionAuthorPoints } }, { session })
    return
  }

  if ((action === "upvote" || action === "downvote") && actionTarget === "answer") {
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
            filter: { _id: questionAuthorId },
            update: { $inc: { reputation: questionAuthorPoints } },
          },
        },
        {
          updateOne: {
            filter: { _id: answerAuthorId },
            update: { $inc: { reputation: answerAuthorPoints } },
          },
        },
      ],
      { session },
    )
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
          filter: { _id: questionAuthorId },
          update: { $inc: { reputation: questionAuthorPoints } },
        },
      },
    ],
    { session },
  )
  return
}
