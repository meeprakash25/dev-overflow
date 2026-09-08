import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import ROUTES from "@/constants/routes"
import { signOut } from "@/auth"
import Image from "next/image"

const Home = async () => {

  const session = await auth()
  console.log(session)

  return (
    <div className="px-10 pt-24">
      <h1 className="h1-bold">Hello World</h1>
      <form className="pt-10"
        action={ async () => {
          "use server"
          await signOut({redirectTo: ROUTES.SIGN_IN})
        }}
      >

        <Button type="submit">Log out</Button>
      </form>
    </div>
  )
}

export default Home
