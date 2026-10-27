"use client"

import { useState } from "react"
import JobCard from "../cards/JobCard"
import { fetchJobs } from "@/lib/actions/job.action"
import { Button } from "../ui/button"

interface JobListProps {
  initialJobs: Job[]
  initialCursor?: string
  query: string
}

export default function JobList({ initialJobs, initialCursor, query }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [cursor, setCursor] = useState<string | undefined>(initialCursor)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (!cursor || loading) return

    setLoading(true)
    try {
      const response = await fetchJobs({query, cursor})
      // Append new jobs to the existing list
      setJobs((prev) => [...prev, ...response.data])
      // Update cursor for the next request
      setCursor(response.cursor)
    } catch (error) {
      console.error("Error loading more jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {jobs?.length > 0 ?
        jobs?.filter((job: Job) => job.job_title).map((job: Job) => <JobCard key={job.job_id} job={job} />)
      : <div className="paragraph-regular text-dark200_light800 w-full text-center">
          Oops! We couldn&apos;t find any jobs at the moment. Please try again later
        </div>
      }

      {cursor && (
        <Button
          onClick={loadMore}
          disabled={loading}
          className="w-full primary-gradient min-h-[46px] px-4 py-3 text-light-900 rounded-lg  disabled:bg-gray-400 transition">
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  )
}
