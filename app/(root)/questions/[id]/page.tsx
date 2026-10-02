import Preview from "@/components/cards/Preview"
import TagCard from "@/components/cards/TagCard"
import Metric from "@/components/ui/Metric"
import UserAvatar from "@/components/UserAvatar"
import ROUTES from "@/constants/routes"
import { getQuestion, incrementViews } from "@/lib/actions/question.action"
import { formatNumber, getTimeStamp } from "@/lib/utils"
import Link from "next/link"
import { redirect } from "next/navigation"
import { after } from "next/server"

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params
  const { page, pageSize, filter } = await searchParams

  const [_, { success, data: question }] = await Promise.all([
    await incrementViews({ questionId: id }),
    await getQuestion({ questionId: id }),
  ])
  
  // const { success, data: question } = await getQuestion({ questionId: id })
  // after(async () => {
  //   await incrementViews({ questionId: id })
  // })

  if (!success || !question) return redirect("/404")

  const { author, createdAt, answers, views, tags, content, title } = question

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">{author.name}</p>
            </Link>
          </div>
          <div className="flex justify-end">Votes</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">{question.title}</h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(question.createdAt)}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="answers"
          value={question.answers}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="views"
          value={formatNumber(question.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id as string} name={tag.name} compact/>
        ))}
      </div>
    </>
  )
}

export default QuestionDetails
