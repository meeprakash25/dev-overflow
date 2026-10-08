import ROUTES from "@/constants/routes"
import Link from "next/link"
import { Avatar, AvatarFallback } from "./ui/avatar"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Props {
  id: string
  name?: string
  imageUrl?: string
  className?: string
  fallbackClassName?: string
}

const UserAvatar = ({ id, name, imageUrl, className = "h-8 w-8", fallbackClassName }: Props) => {
  const initials =
    name ??
    ""
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={cn("relative", className)}>
        {imageUrl ?
          <Image
            src={imageUrl}
            alt={name ?? "avatar"}
            className="object-cover rounded-full"
            fill
            quality={100}
          />
        : <AvatarFallback
            className={cn(
              "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
              fallbackClassName,
            )}>
            {initials}
          </AvatarFallback>
        }
      </Avatar>
    </Link>
  )
}

export default UserAvatar
