import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import ROUTES from "@/constants/routes"
import NavLinks from "./NavLinks"

const MobileNavigation = () => {
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavigation
