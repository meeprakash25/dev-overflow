import { auth } from "@/auth"

const Home = async () => {

  const session = await auth()
  console.log(session)

  return (
    <div className="px-10 pt-24">
      <h1 className="h1-bold">Hello World</h1>
    </div>
  )
}

export default Home
