"use client"

import { useState } from "react"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "../ui/toast"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { deleteQuestion } from "@/lib/actions/question.action"
import { deleteAnswer } from "@/lib/actions/answer.action"

interface Props {
  type: string
  itemId: string
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const handleEdit = async () => {
    router.push(`/questions/${itemId}/edit`)
  }

  const handleDelete = async () => {
    if (type === "question") {
      const { success, error } = await deleteQuestion({ questionId: itemId })
      if (!success) {
        toast.add({
          title: "Question not deleted",
          description: error?.message || "Something went wrong",
          type: "error",
        })
        return
      }

      toast.add({
        title: "Question deleted",
        description: "Your question has been deleted.",
        type:"success"
      })
    } else {
      const { success, error } = await deleteAnswer({ answerId: itemId })
      if (!success) {
        toast.add({
          title: "Answer not deleted",
          description: error?.message || "Something went wrong",
          type: "error",
        })
        return
      }

      toast.add({
        title: "Answer deleted",
        description: "Your answer has been deleted.",
        type: "success",
      })
    }

    setIsDialogOpen(false)
  }

  return (
    <div className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "answer" && "gap-0 justify-center"}`}>
      {type === "question" && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Image
                src="/icons/edit.svg"
                alt="edit"
                width={14}
                height={14}
                className="cursor-pointer object-contain"
                onClick={handleEdit}
              />
            }
          />
          <TooltipContent>
            <p>Edit Question</p>
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label={`Delete ${type}`}
              className="cursor-pointer"
              onClick={() => setIsDialogOpen(true)}>
              <Image src="/icons/trash.svg" alt="" width={14} height={14} className="object-contain" />
            </button>
          }
        />
        <TooltipContent>
          <p>Delete {type === "question" ? "Question" : "Answer"}</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "question" ? "question" : "answer"} and remove from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction className="border-primary-100! bg-primary-500! text-light-800!" onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EditDeleteAction