import Image from "next/image"
import Link from "next/link"
import ModeToggle from "./ModeToggle"
import MobileNavigation from "./MobileNavigation"
import { auth } from "@/auth"
import UserAvatar from "@/components/UserAvatar"

const Navbar = async () => {
  const session = await auth()
  const userId = session?.user?.id

  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 py-4 px-6 shadow-light-300 dark:shadow-none">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          alt="DevFlow Logo"
          width={23}
          height={23}
          className="invert-dark object-contain dark:invert"
        />
        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Flow</span>
        </p>
      </Link>
      <p>Global Search</p>
      <div className="flex-between gap-5">
        <ModeToggle />

        { session?.user?.id && <UserAvatar id={ session.user.id } name={ session.user.name } imageUrl={session.user?.image} />}

        <MobileNavigation />
      </div>
    </nav>
  )
}

export default Navbar
