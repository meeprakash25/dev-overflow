"use client"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import Image from "next/image"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url"

interface Props {
  route: string
  imgSrc: string
  placeholder: string
  iconPosition?: "left" | "right"
  otherClasses?: string
}

const LocalSearch = ({ route, imgSrc, placeholder, iconPosition="left", otherClasses }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const searchParamsString = searchParams.toString()

  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery && searchQuery !== query) {
        const newUrl = formUrlQuery({ params: searchParamsString, key: "query", value: searchQuery })
        router.push(newUrl)
      } else {
        if (pathname === route && !searchQuery && query) {
          const newUrl = removeKeysFromUrlQuery({ params: searchParamsString, keysToRemove: ["query"] })
          router.push(newUrl)
        }
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, query, router, route, searchParamsString, pathname])

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
      {iconPosition === "left" && (
        <Image src={imgSrc} alt="Search" width={22} height={22} className="invert-colors cursor-pointer" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {iconPosition === "right" && (
        <Image src={imgSrc} alt="Search" width={18} height={18} className="invert-colors cursor-pointer" />
      )}
    </div>
  )
}

export default LocalSearch
