import LocalSearch from "@/components/search/LocalSearch"
import { Button } from "@/components/ui/button"
import ROUTES from "@/constants/routes"
import Link from "next/link"

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>
}

const questions = [
  {
    _id: "1",
    title: "How to use github copilot?",
    description: "I am new to github copilot and I want to know how to use it. Can someone help me?",
    tags: [
      { _id: "1", name: "github" },
      { _id: "2", name: "copilot" },
      { _id: "3", name: "ai" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      avatar: "/images/avatar.jpg",
    },
    upvotes: 100,
    downvotes: 20,
    answers: 8,
    views: 500,
    createdAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    _id: "2",
    title: "How to use React Query?",
    description: "I am new to React Query and I want to know how to use it. Can someone help me?",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "query" },
      { _id: "3", name: "data-fetching" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      avatar: "/images/avatar.jpg",
    },
    upvotes: 10,
    downvotes: 2,
    answers: 5,
    views: 100,
    createdAt: new Date("2023-01-02T00:00:00Z"),
  },
  {
    _id: "3",
    title: "How to use Redux?",
    description: "I am new to Redux and I want to know how to use it. Can someone help me?",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "redux" },
      { _id: "3", name: "state-management" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      avatar: "/images/avatar.jpg",
    },
    upvotes: 50,
    downvotes: 5,
    answers: 15,
    views: 300,
    createdAt: new Date("2023-01-03T00:00:00Z"),
  },
]
const Home = async ({ searchParams }: SearchParams) => {
  const { query="" } = await searchParams
  const filteredQuestions = questions.filter((question) => {
    return question.title.toLowerCase().includes(query?.toLowerCase())
  })
  
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900_dark200">
          <Link href={ROUTES.ASK_QUESTION} className="flex items-center gap-2 text-dark100_light900">
            Ask a Question
          </Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch route={ROUTES.HOME} imgSrc="/icons/search.svg" placeholder="Search Questions..." otherClasses="" />
      </section>
      HomeFilter
      <div className="mt-10 w-full flex flex-col gap-6">
        { filteredQuestions.map((question) => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  )
}

export default Home
