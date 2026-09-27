interface SigninWithOAuthParams {
  provider: "github" | "google"
  providerAccountId: string
  user: {
    name: string
    username: string
    email: string
    image: string
  }
}

interface AuthCredentials {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface CreateQuestionParams {
  title: string
  content: string
  tags: string[]
}