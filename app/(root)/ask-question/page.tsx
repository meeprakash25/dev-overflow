import { auth } from "@/auth"
import QuestionForm from "@/components/forms/QuestionForm"
import ROUTES from "@/constants/routes"
import { redirect } from "next/navigation"

const AskQuestion = async () => {
  const session = await auth()
  if (!session) return redirect(ROUTES.SIGN_IN)

  return (
    <>
      <div className="h1-bold text-dark100_light900">QuestionForm</div>
      <div className="mt-9">
        <QuestionForm />
      </div>
    </>
  )
}

export default AskQuestion
