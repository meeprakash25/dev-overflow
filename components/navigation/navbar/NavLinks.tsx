"use client"

import { sideBarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathname = usePathname()
  const userId = 1
  return (
    <>
      {sideBarLinks.map((item) => {
        const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route

        if (item.route === "/profile") {
          if (userId) item.route = `${item.route}/${userId}`
          else return null
        }
        const linkComponent = (
          <Link
            href={item.route}
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
