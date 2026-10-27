import { Skeleton } from "../ui/skeleton"

const JobListLoading = () => {
  return (
    <div aria-label="Loading jobs" className="space-y-6">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="background-light900_dark200 light-border flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
          <Skeleton className="size-16 shrink-0 rounded-xl" />

          <div className="w-full">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-6">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default JobListLoading
