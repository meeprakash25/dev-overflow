import QuestionCard from "@/components/cards/QuestionCard"
import HomeFilter from "@/components/filters/HomeFilter"
import LocalSearch from "@/components/search/LocalSearch"
import { Button } from "@/components/ui/button"
import ROUTES from "@/constants/routes"
import { getQuestions } from "@/lib/actions/question.action"
import Link from "next/link"
import { defaultPageSize } from "@/constants"
import DataRenderer from "@/components/DataRenderer"
import { EMPTY_QUESTION } from "@/constants/states"
import CommonFilter from "@/components/filters/CommonFilter"
import { HomeFilters } from "@/constants/filters"
import Pagination from "@/components/Pagination"

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>
}

const Home = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || defaultPageSize,
    query: query || "",
    filter: filter || "",
  })

  const { questions, isNext } = data || {}

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={ROUTES.ASK_QUESTION} className="flex items-center gap-2 text-dark100_light900">
          <Button className="w-full primary-gradient min-h-[46px] px-4 py-3 text-light-900">Ask Question</Button>
        </Link>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch route={ ROUTES.HOME } imgSrc="/icons/search.svg" placeholder="Search Questions..." otherClasses="" />
        <CommonFilter
          filters={ HomeFilters }
          otherClasses="min-h-[56px] sm:min-w-[170px] w-full"
        />
      </section>
      
      <HomeFilter />

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      <Pagination
        page={ page }
        isNext={ isNext || false }
      />

    </>
  )
}

export default Home
