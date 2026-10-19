import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="size-[140px] shrink-0 rounded-full" />
          <div className="mt-3 flex w-full flex-col gap-3">
            <Skeleton className="h-8 w-48 max-w-full" />
            <Skeleton className="h-5 w-36 max-w-full" />
            <div className="mt-2 flex flex-wrap gap-5">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="mt-3 h-5 w-full max-w-lg" />
          </div>
        </div>
        <Skeleton className="h-12 w-full shrink-0 rounded-md sm:w-44" />
      </section>

      <section className="mt-10">
        <Skeleton className="h-8 w-40" />
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28 rounded-md" />
          ))}
        </div>
      </section>

      <div className="mt-10 flex gap-10">
        <section className="min-w-0 flex-[2]">
          <div className="flex min-h-[42px] w-full gap-1 rounded-md p-1 sm:w-md">
            <Skeleton className="h-9 min-w-0 flex-1 rounded-sm" />
            <Skeleton className="h-9 min-w-0 flex-1 rounded-sm" />
          </div>

          <div className="mt-5 flex w-full flex-col gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card-wrapper rounded-[10px] p-7 sm:px-11 sm:py-9">
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
        </section>

        <aside className="hidden min-w-[250px] flex-1 flex-col lg:flex">
          <Skeleton className="h-8 w-32" />
          <div className="mt-7 flex flex-col gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}

export default Loading
