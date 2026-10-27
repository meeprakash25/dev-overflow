import { cache } from "react"

export const fetchLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=country")
  const location = await response.json()
  return location.country
}

export const fetchCountries = async (): Promise<{ success: boolean, countries: Country[]}> => {
  const API_KEY = process.env.NEXT_RESTCOUNTRIES_API_KEY
  const BASE_URL = "https://api.restcountries.com/countries/v5"

  let allCountries: Country[] = []
  let offset = 0
  const limit = 100 // Free tier max limit
  let hasMore = true

  try {
    while (hasMore) {
      const response = await fetch(
        `${BASE_URL}?response_fields=names.common,flag.emoji&limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      )

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorPayload = await response.json();
          if (errorPayload?.errors && Array.isArray(errorPayload.errors) && errorPayload.errors[0]?.message) {
            errorMessage = errorPayload.errors[0].message;
          }
        } catch (e) {
          // ignore JSON parse errors, use default errorMessage
        }
        throw new Error(errorMessage);
      }

      const payload = await response.json()

      type Element = {
        names: { common: string }
        flag: { emoji: string }
      }

      if (payload.data.objects.length > 0) {
        allCountries = payload.data.objects.map((element: Element) => ({
          name: { common: element.names.common },
          flag: { emoji: element.flag.emoji }
        }))
      }

      // Update pagination control variables from the meta block
      if (payload?.data?.meta) {
        hasMore = payload.data.meta.more
        offset += limit
      } else {
        hasMore = false
      }
    }

    console.log(`Successfully fetched ${allCountries.length} countries!`)
    return {
      success: true,
      countries: allCountries
    }
  } catch (error: any) {
    return {
      success: false,
      countries: allCountries,
    }
  }
}

interface JSearchResponse {
  status: string
  data: Job[]
  cursor?: string
}

export const fetchJobs = async (filters: JobFilterParams): Promise<JSearchResponse> => {
  const { query, cursor } = filters

  // console.log("Query:", query)

  const headers = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  }

  const url = new URL("https://jsearch.p.rapidapi.com/search-v2")
  url.searchParams.append("query", query)
  if (cursor) url.searchParams.append("cursor", cursor)
  
  console.log(url)

  const response = await fetch(url.toString(), {
    headers,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs (${response.status})`)
  }

  const result = await response.json()

  // const result = (await response.json()) as { data?: { jobs?: Job[] } }

  // if (!Array.isArray(jobs)) {
  //   throw new Error("Job search returned an invalid response")
  // }

  console.log(result.data.jobs?.[0])

  // return jobs

  return {
    status: response.status.toString(),
    data: result.data.jobs,
    cursor: result.data.cursor
  }
}
