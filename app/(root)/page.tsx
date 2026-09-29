import QuestionCard from "@/components/cards/QuestionCard"
import HomeFilter from "@/components/filters/HomeFilter"
import LocalSearch from "@/components/search/LocalSearch"
import { Button } from "@/components/ui/button"
import ROUTES from "@/constants/routes"
import { getQuestions } from "@/lib/actions/question.action"
import Link from "next/link"
import { defaultPageSize } from "@/constants"

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

  const { questions } = data || {}

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light900_dark200">
          <Link href={ROUTES.ASK_QUESTION} className="flex items-center gap-2 text-dark100_light900">
            Ask Question
          </Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch route={ROUTES.HOME} imgSrc="/icons/search.svg" placeholder="Search Questions..." otherClasses="" />
      </section>
      <HomeFilter />
      {success ?
        <div className="mt-10 w-full flex flex-col gap-6">
          {questions && questions.length > 0 ?
            questions.map((question) => <QuestionCard key={question._id} question={question} />)
          : <div className="mt-10 flex w-full items-center justify-center">
              <p className="textdark400_light700">No questions found</p>
            </div>
          }
        </div>
      : <div className="mt-10 flex w-full items-center justify-center">
          <p className="text-dark400_light700">{error?.message || "Failed to fetch questions"}</p>
        </div>
      }
    </>
  )
}

export default Home
