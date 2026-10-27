import JobsContent from "@/components/jobs/JobsContent"
import { fetchCountries, fetchJobs, fetchLocation } from "@/lib/actions/job.action"

const Page = async ({ searchParams }: RouteParams) => {
  const { query, location } = await searchParams
  const userLocation = await fetchLocation()

  const countries = await fetchCountries()
  
  const formedQuery =
    query ?
      location ? `${query} in ${location}`
      : query
    : `Software Engineer in ${location || userLocation}`

  const { data, cursor, status } = await fetchJobs({ query: formedQuery })


  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Find Jobs</h1>

      <JobsContent
        countriesList={countries.countries}
        initialJobs={data}
        initialCursor={cursor}
        query={formedQuery}
        searchQuery={query}
        location={location}
        defaultLocation={userLocation}
      />
    </>
  )
}

export default Page
