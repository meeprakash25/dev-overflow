import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback } from "./avatar"

interface Props {
  imgUrl: string
  alt: string
  value: string | number
  title: string
  href?: string
  textStyles?: string
  titleStyles?: string
  imgStyles?: string
  isAuthor?: boolean
}

const Metric = ({ imgUrl, alt, value, title, href, textStyles, imgStyles, isAuthor = false, titleStyles }: Props) => {
    const initials =
      alt
        ?.trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ?? ""
  
  const metricContent = (
    <>
      {imgUrl ?
        <Image src={imgUrl} width={16} height={16} alt={alt} className={`rounded-full object-contain ${imgStyles}`} />
      : <Avatar className="size-4 after:border-gray-300! dark:after:border-gray-300!">
          <AvatarFallback className="primary-gradient font-space-grotesk text-[8px] font-bold tracking-wider text-white ">
            {initials}
          </AvatarFallback>
        </Avatar>
      }
      <p className={`body-medium ${textStyles} flex items-center gap-1`}>
        {value}
        {title ?
          <span className={cn(`small-regular line-clamp-1`, titleStyles)}>{title}</span>
        : ""}
      </p>
    </>
  )

  return href ?
      <Link href={href} className="flex items-center gap-2">
        {metricContent}
      </Link>
    : <div className="flex-center gap-1">{metricContent}</div>
}

export default Metric
