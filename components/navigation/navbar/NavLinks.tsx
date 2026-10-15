"use client"

import { sideBarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavLinks = ({ isMobileNav = false, userId }: { isMobileNav?: boolean, userId?:string }) => {
  const pathname = usePathname()
  return (
    <>
      {sideBarLinks.map((item) => {
        const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route
        const href = item.route === "/profile" ? (userId ? `${item.route}/${userId}` : null) : item.route

        if (!href) return null
        const linkComponent = (
          <Link
            href={href}
            key={item.label}
            className={cn(
              isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900",
              "flex items-center gap-4 bg-transparent p-4 w-full",
            )}>
            <Image
              src={item.imgUrl}
              alt={item.label}
              width={20}
              height={20}
              className={cn("invert-colors", !isActive)}
            />
            <p className={cn(isActive ? "base-bold" : "base-medium", !isMobileNav && "max-lg:hidden")}>{item.label}</p>
          </Link>
        )
        return linkComponent
      })}
    </>
  )
}

export default NavLinks
