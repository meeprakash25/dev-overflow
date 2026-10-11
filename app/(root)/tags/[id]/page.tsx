import QuestionCard from "@/components/cards/QuestionCard"
import LocalSearch from "@/components/search/LocalSearch"
import ROUTES from "@/constants/routes"
import { defaultPageSize } from "@/constants"
import DataRenderer from "@/components/DataRenderer"
import { EMPTY_QUESTION } from "@/constants/states"
import CommonFilter from "@/components/filters/CommonFilter"
import { TagFilters } from "@/constants/filters"
import Pagination from "@/components/Pagination"
import { getTagQuestions } from "@/lib/actions/tag.action"

const TagQuestions = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params
  const { page, pageSize, query, filter } = await searchParams

  const { success, data, error } = await getTagQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || defaultPageSize,
    query: query || "",
    filter: filter || "",
  })

  const { tag, questions, isNext } = data || {}

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Questions related to #{tag?.name.toUpperCase()}</h1>
      </section>
      <section className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAG(id)}
          imgSrc="/icons/search.svg"
          placeholder={`Search questions related to #${tag?.name.toUpperCase()}`}
          otherClasses=""
        />
        <CommonFilter filters={TagFilters} otherClasses="min-h-[56px] sm:min-w-[170px] w-full" />
      </section>
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

      {questions && questions.length > 0 && <Pagination page={page} isNext={isNext || false} />}
    </>
  )
}

export default TagQuestions
