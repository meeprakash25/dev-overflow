import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-56 max-w-full" />
        <Skeleton className="min-h-[46px] w-full rounded-md sm:w-36" />
      </section>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[56px] min-w-0 flex-1 rounded-[10px]" />
        <Skeleton className="min-h-[56px] w-full sm:w-[170px]" />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="card-wrapper rounded-[10px] p-9 sm:px-11">
            <div className="flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-start">
              <Skeleton className="h-7 w-3/4 sm:w-2/3" />
              <Skeleton className="h-6 w-24 shrink-0" />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <Skeleton className="h-6 w-40" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Loading
