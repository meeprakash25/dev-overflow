"use client"

import { Button } from "../ui/button"
import Image from "next/image"
import { toast } from "../ui/toast"
import { signIn } from "next-auth/react"
import ROUTES from "@/constants/routes"

const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 px-4 py-3.5"

  const handleSignin = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: true,
      })
    } catch (error) {
      console.log(error)
      toast.add({
        title: "Sign-in failed",
        description: error instanceof Error ? error.message : "An error occured during sign-in",
        type: "error",
      })
    }
  }

  return (
    <div className="mt-10 flex flex-wrap gap-2 3">
      <Button className={buttonClass} onClick={() => handleSignin("github")}>
        <Image
          className="invert-colors mr-2.5 object-contain"
          src="/icons/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
        />
        <span>Login with Github</span>
      </Button>
      <Button className={buttonClass} onClick={() => handleSignin("google")}>
        <Image className="mr-2.5 object-contain" src="/icons/google.svg" alt="Google Logo" width={20} height={20} />
        <span>Login with Google</span>
      </Button>
    </div>
  )
}

export default SocialAuthForm
