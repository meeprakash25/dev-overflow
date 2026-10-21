import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Our Community</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[56px] min-w-0 flex-1 rounded-[10px]" />
        <Skeleton className="min-h-[56px] w-full sm:w-[170px]" />
      </div>

      <div className="mt-12 flex flex-wrap gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <article
            key={item}
            className="background-light900_dark200 light-border flex w-full flex-col items-center rounded-2xl border p-8 shadow-light100_darknone xs:w-[230px]"
          >
            <Skeleton className="size-[100px] rounded-full" />
            <div className="mt-4 flex w-full flex-col items-center gap-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Loading