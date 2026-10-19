import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <>
      <section className="w-full">
        <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="size-[22px] rounded-full" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="flex items-center justify-end gap-4">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>
        <Skeleton className="mt-3.5 h-8 w-full max-w-3xl sm:h-10" />
      </section>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>

      <section className="light-border background-light900_dark300 rounded-md border p-5 sm:p-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="mt-2 h-40 w-full rounded-md sm:h-56" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>

      <section className="my-5">
        <div className="mt-11">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-10 w-full max-w-44 rounded-md" />
          </div>
          <div className="mt-6 flex flex-col gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="card-wrapper rounded-[10px] p-6 sm:px-10 sm:py-8">
                <Skeleton className="h-5 w-32" />
                <div className="mt-5 flex flex-col gap-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="my-5">
        <div className="w-full space-y-4 pt-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-10 w-full rounded-md sm:w-48" />
          </div>
          <Skeleton className="h-56 w-full rounded-md sm:h-72" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-full rounded-md sm:w-36" />
          </div>
        </div>
      </section>
    </>
  )
}

export default Loading
