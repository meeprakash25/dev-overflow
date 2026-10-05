import handleError from "@/lib/handlers/error"
import { ValidationError } from "@/lib/http-errors"
import { AIAnswerSchema } from "@/lib/validations"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { question, content, userAnswer } = await req.json()

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content, userAnswer })

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors)
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
              "You provide helpful, accurate answers in Markdown. Use appropriate Markdown for headings, lists, code, and emphasis. Use short lowercase language identifiers in fenced code blocks, such as js, py, ts, html, or css.",
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

            Use the draft only when it is correct. Correct or complete it when needed, and return the final answer in Markdown.`,
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
    const text = result.choices?.[0]?.message?.content

    if (!text) {
      throw new Error(result.error?.message ?? "OpenRouter returned an empty answer")
    }

    return NextResponse.json({ success: true, data: text }, { status: 200 })
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse
  }
}
