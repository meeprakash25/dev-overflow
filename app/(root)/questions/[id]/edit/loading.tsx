import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <>
      <Skeleton className="h-10 w-56 max-w-full" />

      <div className="mt-9">
        <div className="flex w-full flex-col gap-10">
          <section className="flex w-full flex-col gap-2">
            <Skeleton className="h-6 w-40 max-w-full" />
            <Skeleton className="min-h-14 w-full rounded-md" />
            <Skeleton className="mt-2.5 h-4 w-full max-w-lg" />
          </section>

          <section className="flex w-full flex-col gap-2">
            <Skeleton className="h-6 w-64 max-w-full" />
            <Skeleton className="h-64 w-full rounded-md sm:h-80" />
            <Skeleton className="mt-2.5 h-4 w-full max-w-lg" />
          </section>

          <section className="flex w-full flex-col gap-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="min-h-14 w-full rounded-md" />
            <Skeleton className="mt-2.5 h-4 w-full max-w-xl" />
          </section>

          <div className="mt-6 flex justify-end">
            <Skeleton className="h-12 w-full rounded-md sm:w-40" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Loading
