"use client"

import ROUTES from "@/constants/routes"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

const RefreshOnHomeReturn = () => {
  const pathname = usePathname()
  const router = useRouter()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const returnedToHome = pathname === ROUTES.HOME && previousPathname.current !== ROUTES.HOME
    previousPathname.current = pathname

    if (returnedToHome) router.refresh()
  }, [pathname, router])

  return null
}

export default RefreshOnHomeReturn