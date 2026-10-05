import handleError from "@/lib/handlers/error"
import { ValidationError } from "@/lib/http-errors"
import { AIAnswerSchema } from "@/lib/validations"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { question, content } = await req.json()

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content })

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors)
    }

    // const { text } = await generateText({
    //   model: openai("gpt-4o-mini"),
    //   prompt: `Generate a markdown-formatted response to the following question: ${question}. Based on the provided content: ${content}. Ensure the response is clear, concise, and informative.`,
    //   system:
    //     "You are a helpful assistant that provides informative response in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    // })

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured")
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": new URL(req.url).origin,
        "X-Title": "DevFlow",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: `Generate a markdown-formatted response to the following question: ${question}. Based on the provided content: ${content}. Ensure the response is clear, concise, and informative.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorBody = (await response.json()) as { error?: { message?: string } }
      throw new Error(errorBody.error?.message ?? `API request failed (${response.status})`)
    }

    const result = await response.json()
    const text = result.choices?.[0]?.message?.content

    return NextResponse.json({ success: true, data: text }, { status: 200 })
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse
  }
}
