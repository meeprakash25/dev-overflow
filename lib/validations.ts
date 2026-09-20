import { z } from "zod"

export const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string({ message: "Password must be a string" }).min(8, "Password must be at least 8 characters"),
})

export const SignUpSchema = z
  .object({
    name: z.string({ message: "Name must be a string" }).min(3, "Name must be at least 3 characters"),
    username: z.string({ message: "Username must be a string" }).min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string({ message: "Password must be a string" })
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
  title: z
    .string({ message: "Title must be a string" })
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  content: z.string({ message: "Content must be a string" }).min(1, "Content is required"),
  tags: z
    .array(
      z
        .string({ message: "Tag must be a string" })
        .min(1, "Tag cannot be empty")
        .max(20, "Tag cannot exceed 20 characters"),
    )
    .min(1, "At least one tag is required")
    .max(3, "You can select up to 3 tags"),
})

export const UserSchema = z.object({
  name: z.string({ message: "Name must be a string" }).min(1, { message: "Name is required" }),
  username: z
    .string({ message: "Username must be a string" })
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.email({ message: "Email must be a string" }).min(1, { message: "Please provide a valid email address" }),
  bio: z.string({ message: "Bio must be a string" }).optional(),
  image: z.url({ message: "Please provide a valid URL" }).optional(),
  location: z.string({ message: "Location must be a string" }).optional(),
  portfolio: z.url({ message: "Please provide a valid URL" }).optional(),
  reputation: z.number().optional(),
})
