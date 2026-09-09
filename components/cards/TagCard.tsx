import ROUTES from "@/constants/routes"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { getDeviconClassName } from "@/lib/utils"

interface Props {
  _id: string
  name: string
  questions: number
  showCount?: Boolean
  compact?: Boolean
}

const TagCard = ({ _id, name, questions, showCount, compact }: Props) => {
  const iconClass = getDeviconClassName(name)
  return (
    <Link href={ROUTES.TAGS(_id)} className="flex cursor-pointer justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-dark400_light500 rounded-sm border-none 
      px-3 py-2 uppercase">
        <i className={`${iconClass} text-sm`}></i>
        <span>{name}</span>
      </Badge>
      {showCount && <p className="subtle-medium text-dark500_light700">{questions}</p>}
    </Link>
  )
}

export default TagCard
