"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import { use, useState } from "react"
import { toast } from "../ui/toast"
import { toggleSaveQuestion } from "@/lib/actions/collection.action"
import { boolean } from "zod"

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: {
  questionId: string
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>
}) => {
  const session = useSession()
  const userId = session?.data?.user?.id

  const { data } = use(hasSavedQuestionPromise)

  const { saved: hasSaved } = data || {}

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (isLoading) return
    if (!userId) {
      return toast.add({
        title: "You need to be logged in to save question",
        type: "error",
      })
    }

    setIsLoading(true)

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId })
      if (!success) throw new Error(error?.message || "An error occured")

      toast.add({
        title: `Question ${data?.saved ? "saved" : "unsaved"}`,
        type: "success",
      })
    } catch (error) {
      return toast.add({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occured",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading} && 'opacity-50'`}
      aria-label="Save question"
      onClick={handleSave}
    />
  )
}

export default SaveQuestion
