import { auth } from "@/auth"
import handleError from "@/lib/handlers/error"
import { ForbiddenError, NotFoundError, ValidationError } from "@/lib/http-errors"
import { AIAnswerSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import mongoose from "mongoose"
import AiAnswer, { IAiAnswerDoc } from "@/app/(root)/database/ai-answer.model"
import User from "@/app/(root)/database/user.model"
import { maxAiAnswerCount } from "@/constants"

export async function POST(req: Request): Promise<APIResponse> {
  const { questionId, question, content, userAnswer } = await req.json()

  console.log(questionId)

  try {
    const validatedData = AIAnswerSchema.safeParse({ questionId, question, content, userAnswer })

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors)
    }

    const authSession = await auth()
    const userId = authSession?.user?.id
    if (!userId) throw new Error("Authentication required")

    const user = await User.findById(userId).select("aiAnswerCount")
    if (!user) throw new NotFoundError("User")
    if ((user.aiAnswerCount ?? 0) >= maxAiAnswerCount) {
      throw new ForbiddenError("You have reached the limit of 5 AI-generated answers.")
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured")
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": new URL(req.url).origin,
        "X-Title": "DevFlow",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content:
              "You provide helpful, accurate answers in Markdown. Use appropriate Markdown for headings, lists, code, and emphasis. Use short lowercase language identifiers in fenced code blocks, such as js, py, ts, html, or css. Return only the answer; never include safety classifications, moderation notes, internal analysis, or labels such as 'User Safety: safe'.",
          },
          {
            role: "user",
            content: `Write a clear, concise answer to the following question using the provided context.

            Question:
            ${question}

            Context:
            ${content}

            User's draft answer:
            ${userAnswer?.trim() || "No draft answer was provided."}

            Use the draft only when it is correct. Correct or complete it when needed, and return the final answer in Markdown. Do not include safety classifications, moderation notes, or internal analysis.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`OpenRouter request failed (${response.status}): ${errorBody}`)
    }

    const result = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>
      error?: { message?: string }
    }
    const generatedText = result.choices?.[0]?.message?.content

    if (!generatedText) {
      throw new Error(result.error?.message ?? "OpenRouter returned an empty answer")
    }

    const text = generatedText.replace(/^\s*User Safety:\s*safe\s*$/gim, "").trim()
    if (!text) {
      throw new Error("Failed to generate answer, please try again")
    }

    await SaveAiAnswer({ questionId, answer: text, userId })

    return NextResponse.json({ success: true, data: text }, { status: 200 })
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse
  }
}

const SaveAiAnswer = async ({
  questionId,
  answer,
  userId,
}: {
  questionId: string
  answer: string
  userId: string
}): Promise<IAiAnswerDoc> => {
  const mSession = await mongoose.startSession()
  mSession.startTransaction()

  try {
    const [aiAnswer] = await AiAnswer.create(
      [
        {
          question: questionId,
          user: userId,
          answer,
        },
      ],
      { session: mSession },
    )

    if (!aiAnswer) throw new Error("Failed to save AI answer")

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        $or: [{ aiAnswerCount: { $lt: 5 } }, { aiAnswerCount: { $exists: false } }],
      },
      { $inc: { aiAnswerCount: 1 } },
      { session: mSession },
    )
    if (!user) {
      const existingUser = await User.findById(userId).session(mSession)
      if (!existingUser) throw new NotFoundError("User")
      if ((existingUser.aiAnswerCount ?? 0) >= 5) {
        throw new ForbiddenError(`You have reached the limit of ${maxAiAnswerCount} AI-generated answers.`)
      }
      throw new Error("Failed to update AI answer count")
    }

    await mSession.commitTransaction()

    return aiAnswer
  } catch (error) {
    if (mSession.inTransaction()) await mSession.abortTransaction()
    throw error
  } finally {
    await mSession.endSession()
  }
}
