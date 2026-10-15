import { auth } from "@/auth"
import ROUTES from "@/constants/routes"
import { redirect } from "next/navigation"

const ProfileRedirect = async () => {
  const session = await auth()

  if (!session?.user?.id) redirect(ROUTES.SIGN_IN)

  redirect(ROUTES.PROFILE(session.user.id))
}

export default ProfileRedirect
