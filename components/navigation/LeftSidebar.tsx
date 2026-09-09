import React from "react"
import NavLinks from "./navbar/NavLinks"
import Link from "next/link"
import { Button } from "../ui/button"
import ROUTES from "@/constants/routes"
import Image from "next/image"

const LeftSidebar = () => {
  return (
    <section
      className="custom-scrollbar background-light900_dark200 light-border sticky 
       left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r px-2 lg:px-6 pt-20
       shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[256px]">
      <div className="flex flex-1 flex-col gap-6 lg:items-start items-center">
        <NavLinks />
      </div>
      <div className="flex flex-col gap-3">
        <Link href={ROUTES.SIGN_IN}>
          <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
            <Image src="/icons/account.svg" alt="Account" width={20} height={20} className="invert-colors lg:hidden" />
            <span className="primary-text-gradient max-lg:hidden">Log In</span>
          </Button>
        </Link>
        <Link href={ROUTES.SIGN_UP}>
          <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 border shadow-none">
            <Image src="/icons/sign-up.svg" alt="Account" width={20} height={20} className="invert-colors lg:hidden" />
            <span className="max-lg:hidden">Sign Up</span>
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default LeftSidebar
