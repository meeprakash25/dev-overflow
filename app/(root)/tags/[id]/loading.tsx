import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full max-w-2xl" />
      </section>

      <section className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[56px] min-w-0 flex-1 rounded-[10px]" />
        <Skeleton className="min-h-[56px] w-full sm:w-[170px]" />
      </section>

      <div className="mt-10 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <article key={item} className="card-wrapper rounded-[10px] p-9 sm:px-11">
            <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
              <div className="flex-1">
                <Skeleton className="mb-2 h-3 w-24 sm:hidden" />
                <Skeleton className="h-7 w-full max-w-2xl sm:h-[26px]" />
              </div>
            </div>
            <div className="mt-3 flex w-full flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
            <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-3">
              <Skeleton className="h-6 w-40" />
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default Loading
