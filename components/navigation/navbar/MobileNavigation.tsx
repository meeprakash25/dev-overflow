import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import ROUTES from "@/constants/routes"
import NavLinks from "./NavLinks"
import { auth, signOut } from "@/auth"
import { LogOut } from "lucide-react"

const MobileNavigation = async () => {
  const session = await auth()
  const userId = session?.user?.id

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" className="sm:hidden">
            <Image src="/icons/hamburger.svg" width={25} height={25} alt="menu" className="invert-colors" />
          </Button>
        }
      />
      <SheetContent side="left" className="background-light900_dark200 border-none">
        <SheetHeader>
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/images/site-logo.svg"
              alt="DevFlow Logo"
              width={23}
              height={23}
              className="invert-dark object-contain dark:invert"
            />
            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
              Dev<span className="text-primary-500">Flow</span>
            </p>
          </Link>
        </SheetHeader>
        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col overflow-y-auto px-4">
          <SheetClose
            nativeButton={false}
            render={
              <section className="flex flex-col gap-6">
                <NavLinks isMobileNav />
              </section>
            }
          />
        </div>
        <SheetFooter>
          {userId ?
            <SheetClose
              nativeButton={false}
              render={
                <form
                  action={async () => {
                    "use server"
                    await signOut()
                  }}>
                  <Button type="submit" className="base-medium w-fit bg-transparent! px-4 py-3">
                    <LogOut className="zise-5 text-black dark:text-white" />
                    <span className="text-dark300_light900">Logout</span>
                  </Button>
                </form>
              }
            />
          : <>
              <SheetClose
                nativeButton={false}
                render={
                  <Link href={ROUTES.SIGN_IN}>
                    <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                      <span className="primary-text-gradient">Log In</span>
                    </Button>
                  </Link>
                }
              />
              <SheetClose
                nativeButton={false}
                render={
                  <Link href={ROUTES.SIGN_UP}>
                    <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 border shadow-none">
                      Sign Up
                    </Button>
                  </Link>
                }
              />
            </>
          }
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavigation
