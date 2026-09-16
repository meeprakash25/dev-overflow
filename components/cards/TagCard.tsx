import ROUTES from "@/constants/routes"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { getDeviconClassName } from "@/lib/utils"
import Image from "next/image"

interface Props {
  _id: string
  name: string
  questions?: number
  showCount?: Boolean
  compact?: Boolean
  remove?: boolean
  isButton?: boolean
  handleRemove?: () => void
}

const TagCard = ({ _id, name, questions, showCount, compact, remove, isButton, handleRemove }: Props) => {
  const iconClass = getDeviconClassName(name)
  const content = (
    <>
      <Badge
        className="subtle-medium background-light800_dark300 text-dark400_light500 flex flex-row gap-2 rounded-md border-none 
      py-3 px-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
        { remove && (
          <Image
            src="/icons/close.svg"
            width={ 12 }
            height={ 12 }
            alt="close icon"
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={handleRemove}
          />
        )}
      </Badge>
      {showCount && <p className="subtle-medium text-dark500_light700">{questions}</p>}
    </>
  )

  if (compact) {
    return isButton ?
        <button className="flex justify-between gap-2" onClick={(e)=>e.preventDefault()}>{content}</button>
      : <Link href={ROUTES.TAGS(_id)} className="flex cursor-pointer justify-between gap-2">
          {content}
        </Link>
  }
}

export default TagCard
