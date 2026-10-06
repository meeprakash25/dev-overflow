"use client"

import { formatNumber } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "../ui/toast"

interface Params {
  upvotes: number
  downvotes: number
  hasUpvoted: boolean
  hasDownvoted: boolean
}

const Votes = ({ upvotes, downvotes, hasUpvoted, hasDownvoted }: Params) => {
  const [isLoading, setIsLoading] = useState(false)

  const session = useSession()
  const userId = session.data?.user?.id

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast.add({
        title: "Please login to vote",
        description: "Only logged-in users can vote",
        type: "error",
      })
    }

    setIsLoading(true)

    try {
      const successMessage = voteType === "upvote"
        ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
        : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`
      
      
      
      toast.add({
        title: successMessage,
        description: "Your vote has been recorded.",
        type: "success",
      })
      
    } catch (error) {
      toast.add({
        title: "Failed to vote",
        description: "An error occured while voting, Please try again later.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">{formatNumber(downvotes)}</p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={hasUpvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">{formatNumber(downvotes)}</p>
        </div>
      </div>
    </div>
  )
}

export default Votes
