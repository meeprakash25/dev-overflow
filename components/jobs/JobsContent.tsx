"use client"

import { useCallback, useState } from "react"
import JobsFilter from "@/components/filters/JobFilter"
import JobList from "@/components/jobs/JobList"

interface JobsContentProps {
  countriesList: Country[]
  initialJobs: Job[]
  initialCursor?: string
  query: string
  searchQuery?: string
  location?: string
  defaultLocation: string
}

interface FilterValues {
  query?: string
  location?: string
}

const JobsContent = ({
  countriesList,
  initialJobs,
  initialCursor,
  query,
  searchQuery,
  location,
  defaultLocation,
}: JobsContentProps) => {
  const [pendingFilters, setPendingFilters] = useState<FilterValues | null>(null)

  const handleFilterChange = useCallback((filters: FilterValues) => {
    setPendingFilters(filters)
  }, [])

  const isLoading =
    pendingFilters !== null &&
    (pendingFilters.query !== searchQuery || pendingFilters.location !== location)

  return (
    <>
      <div className="flex">
        <JobsFilter
          countriesList={countriesList}
          location={location || defaultLocation}
          onFilterChange={handleFilterChange}
        />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        <JobList
          key={JSON.stringify([location, searchQuery])}
          initialJobs={initialJobs}
          initialCursor={initialCursor}
          isLoading={isLoading}
          query={query}
        />
      </section>
    </>
  )
}

export default JobsContent
