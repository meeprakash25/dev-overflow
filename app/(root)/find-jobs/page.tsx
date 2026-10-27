import JobsFilter from "@/components/filters/JobFilter"
import JobList from "@/components/jobs/JobList"
import { fetchCountries, fetchJobs, fetchLocation } from "@/lib/actions/job.action"

const Page = async ({ searchParams }: RouteParams) => {
  const { query, location } = await searchParams
  const userLocation = await fetchLocation()

  const formedQuery =
    query ?
      location ? `${query} in ${location}`
      : query
    : `Software Engineer in ${location || userLocation}`

  const { data, cursor, status } = await fetchJobs({ query: formedQuery })

  const countries = await fetchCountries()

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Find Jobs</h1>

      <div className="flex">
        <JobsFilter countriesList={countries.countries} location={location || userLocation} />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        <JobList initialJobs={data} initialCursor={cursor} query={query} />
      </section>
    </>
  )
}

export default Page
