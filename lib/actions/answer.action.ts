"use server"

import Question from "@/app/(root)/database/question.model"
import action from "../handlers/action"
import handleError from "../handlers/error"
import { AnswerServerSchema } from "../validations"
import mongoose from "mongoose"
import Answer, { IAnswerDoc } from "@/app/(root)/database/answer.model"
import ROUTES from "@/constants/routes"
import { revalidatePath } from "next/cache"

export async function createAnswer(params: CreateAnswerParams): Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true
  })

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse
  }
  
  const { content, questionId } = validationResult.params!
  const userId = validationResult.session?.user?.id
  
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

    if(!newAnswer) throw new Error("Failed to create answer")

    question.answers += 1
    await question.save({ session })

    await session.commitTransaction()

    revalidatePath(ROUTES.QUESTION(questionId))

    // return { success: true, data: newAnswer }
    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) }
  } catch (error) {
    if(session.inTransaction()) await session.abortTransaction()
    return handleError(error) as ErrorResponse
  } finally {
    session.endSession()
  }
}