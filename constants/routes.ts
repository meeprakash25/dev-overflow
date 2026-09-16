const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/ask-a-question",
  COLLECTION: "/collection",
  COMMUNITY: "/community",
  JOBS: "/jobs",
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  QUESTION: (id: string) => `/question/${id}`,
}

export default ROUTES