import { z } from "zod"

export const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const SignUpSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid email address"),
 password: z.string()
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
