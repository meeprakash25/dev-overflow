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
          <Skeleton key={item} className="h-60 w-full rounded-2xl xs:w-[230px]" />
        ))}
      </div>
    </section>
  )
}

export default Loading