import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <>
      <Skeleton className="h-10 w-24" />

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[56px] min-w-0 flex-1 rounded-[10px]" />
        <Skeleton className="min-h-[56px] w-full sm:w-[170px]" />
      </section>

      <div className="mt-10 flex w-full flex-wrap gap-4">
        {Array.from({ length: 8 }, (_, index) => (
          <article
            key={index}
            className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 shadow-light100_darknone sm:w-[260px]">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-8 w-32 max-w-full rounded-sm" />
              <Skeleton className="size-7 shrink-0 rounded-full" />
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="mt-3 h-4 w-28" />
          </article>
        ))}
      </div>
    </>
  )
}

export default Loading
