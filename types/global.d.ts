type SuccessResponse<T = null> = ActionResponse<T> & { success: true }
type ErrorResponse<T = null> = ActionResponse<undefined> & { false: true }

type APIErrorResponse = NextResponse<ErrorResponse>
type APIResponse<T = null> = NextResponse<SuccessResponse | ErrorResponse>
interface Tag {
  _id: string
  name: string
}

interface Author {
  _id: string
  name: string
  image: string
}

interface Question {
  _id: string
  title: string
  content: string
  tags: Tag[]
  author: Author
  upvotes: number
  downvotes: number
  answers: number
  views: number
  createdAt: Date
}

type ActionResponse<T = null> = {
  success: boolean
  data?: T
  error?: {
    message: string
    details?: Record<string, string[]>
  }
  status?: number
}

interface RouteParams {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string,string>>
}
