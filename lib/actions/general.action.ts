"use server"

import { Answer, Question, Tag, User } from "@/app/(root)/database"

import action from "../handlers/action"
import handleError from "../handlers/error"
import { GlobalSearchSchema } from "../validations"

export async function globalSearch(params: GlobalSearchParams) {
  try {
    console.log("QUERY", params)

    const validationResult = await action({
      params,
      schema: GlobalSearchSchema,
    })

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse
    }

    const { query, type } = params
    const regexQuery = { $regex: query, $options: "i" }

    let results = []

    type SearchResult = { _id: unknown; question: unknown; [key: string]: unknown }

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ]

    const typeLower = type?.toLowerCase()

    const SearchableTypes = ["question", "answer", "user", "tag"]
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // If no type is specified, search in all models
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await (
          model as unknown as {
            find: (filter: Record<string, unknown>) => {
              limit: (count: number) => PromiseLike<unknown[]>
            }
          }
        )
          .find({ [searchField]: regexQuery })
          .limit(2)

        results.push(
          ...queryResults.map((item) => {
            const result = item as unknown as SearchResult
            return {
              title: type === "answer" ? `Answers containing ${query}` : String(result[searchField] ?? ""),
              type,
              id: type === "answer" ? result.question : result._id,
            }
          }),
        )
      }
    } else {
      // Search in the specified model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type)

      if (!modelInfo) {
        throw new Error("Invalid search type")
      }

      const queryResults = await (
        modelInfo.model as unknown as {
          find: (filter: Record<string, unknown>) => {
            limit: (count: number) => PromiseLike<unknown[]>
          }
        }
      )
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8)

      results = queryResults.map((item) => {
        const result = item as unknown as SearchResult
        return {
          title: type === "answer" ? `Answers containing ${query}` : String(result[modelInfo.searchField] ?? ""),
          type,
          id: type === "answer" ? result.question : result._id,
        }
      })
    }

    console.log(results)

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
