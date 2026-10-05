import { defaultPageSize } from "@/constants"
import { z } from "zod"

export const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password must be a string").min(8, "Password must be at least 8 characters"),
})

export const SignUpSchema = z
  .object({
    name: z.string("Name field is required").min(3, "Name must be at least 3 characters"),
    username: z.string("Username field is required").min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string("Password field is required")
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must be at least one special character"),
    confirmPassword: z.string("Confirm password field is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const AskQuestionSchema = z.object({
  title: z.string("Title must be a string").min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  content: z.string("Content must be a string").min(1, "Content is required"),
  tags: z
    .array(z.string("Tag must be a string").min(1, "Tag cannot be empty").max(20, "Tag cannot exceed 20 characters"))
    .min(1, "At least one tag is required")
    .max(5, "You can select up to 5 tags"),
})

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string("Question ID must be a string").min(1, "Question ID is required"),
})

export const GetQuestionSchema = z.object({
  questionId: z.string("Question ID must be a string").min(1, "Question ID is required"),
})

export const UserSchema = z.object({
  name: z.string("Name must be a string").min(1, "Name is required"),
  username: z.string("Username must be a string").min(3, "Username must be at least 3 characters long."),
  email: z.email("Email must be a string").min(1, "Please provide a valid email address"),
  bio: z.string("Bio must be a string").optional(),
  image: z.url("Please provide a valid URL").optional(),
  location: z.string("Location must be a string").optional(),
  portfolio: z.url("Please provide a valid URL").optional(),
  reputation: z.number().optional(),
})

export const AccountSchema = z.object({
  userId: z.string("User ID must be a string").min(1, "User ID is required"),
  name: z.string("Name must be a string").min(1, "Name is required"),
  image: z.url("Please provide a valid URL").optional(),
  password: z
    .string("Password must be a string")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must be at least one special character")
    .optional(),
  provider: z.string("Provider must be a string").min(1, "Provider is required"),
  providerAccountId: z.string("Provider account ID must be a string").min(1, "Provider account ID is required"),
})

export const SigninWithOauthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z.string("Name must be a string").min(1, "Provider Account ID is required"),
  user: z.object({
    name: z.string("Name must be a string").min(1, "Name is required"),
    username: z.string("Name must be a string").min(3, "Username must be at least 3 characters long"),
    email: z.email("Please provide a valid email address"),
    image: z.url("Invalid image URL").optional(),
  }),
})

export const PaginatedSearchParamsSchema = z.object({
  page: z.number("Page must be a positive integer").int().positive().default(1),
  pageSize: z.number("Page size must be a positive integer").int().positive().default(defaultPageSize),
  query: z.string("Query must be a string").optional(),
  filter: z.string("Filter must be a string").optional(),
  sort: z.string("Sort must be a string").optional(),
})

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string("Tag Id must be a string").min(1, "Tag Id is required"),
  
})

export const IncrementViewsSchema = z.object({
  questionId: z.string("Question Id must be a string").min(1, "Question Id is required"),
})

export const AnswerSchema = z.object({
  content: z.string("Content must be a string").min(30, "Content must be at least 30 characters long"),
})

export const AnswerServerSchema = AnswerSchema.extend({
  questionId: z.string("Question Id must be a string").min(1, "Question Id is required"),
})

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string("Question Id must be a string").min(1, "Question Id is required"),
})

export const AIAnswerSchema = z.object({
  question: z.string("Question must be a string").min(1, "Question is required"),
  content: z.string("Content must be a string").min(30, "Content must be at least 30 characters long"),
})