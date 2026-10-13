import logger from "../logger"
import handleError from "./error"
import { RequestError } from "../http-errors"
import { maxRequestTimeout } from "@/constants"

interface FetchOptions extends RequestInit {
  timeout?: number
}

interface ErrorResponseBody {
  error?: {
    message?: unknown
    details?: unknown
  }
}

function isError(error: unknown): error is Error {
  return error instanceof Error
}

function isErrorResponseBody(body: unknown): body is ErrorResponseBody {
  return typeof body === "object" && body !== null && "error" in body
}

function isFieldErrors(value: unknown): value is Record<string, string[]> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every(
      (messages) => Array.isArray(messages) && messages.every((message) => typeof message === "string"),
    )
  )
}

export async function fetchHandler<T>(url: string, options: FetchOptions = {}): Promise<ActionResponse<T>> {
  const { timeout = maxRequestTimeout, headers: customHeaders = {}, ...restOptions } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders }
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  }

  try {
    const response = await fetch(url, config)
    clearTimeout(id)

    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null)
      const errorBody = isErrorResponseBody(body) ? body.error : undefined
      const message =
        typeof errorBody?.message === "string" ? errorBody.message : `HTTP error: ${response.status}`
      const errors = isFieldErrors(errorBody?.details) ? errorBody.details : undefined

      throw new RequestError(response.status, message, errors)
    }
    return await response.json()
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error")

    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`)
    } else if (!(error instanceof RequestError && error.statusCode < 500)) {
      logger.error(`Error fetching ${url}:${error.message}`)
    }
    return handleError(error) as ActionResponse<T>
  }
}
