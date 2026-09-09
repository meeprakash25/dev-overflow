"use client"

import { Controller, DefaultValues, FieldPath, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import ROUTES from "@/constants/routes"
import Link from "next/link"

interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T, T>
  defaultValues: DefaultValues<T>
  onSubmit: SubmitHandler<T>
  formType: "SIGN_IN" | "SIGN_UP"
}

const AuthForm = <T extends FieldValues>({ schema, defaultValues, formType, onSubmit }: AuthFormProps<T>) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  })

  const handleSubmit: SubmitHandler<T> = async () => {
    console.log("data")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6 pt-6">
      {Object.keys(defaultValues).map((field) => (
        <Controller
          key={String(field)}
          name={field as Path<T>}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="flex-w-full flex-col gap-2" data-invalid={fieldState.invalid ? "true" : undefined}>
              <FieldLabel className="paragraph-medium text-dark400_light700" htmlFor={String(field.name)}>
                {String(field.name).charAt(0).toUpperCase() + String(field.name).slice(1)}
              </FieldLabel>
              <Input
                {...field}
                id={String(field.name)}
                className="paragraph-regular background-light900_dark300 ring-transparent light-border-2 text-dark300_light700 min-h-12 rounded-1.5 border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
                type={field.name == "password" || field.name == "confirmPassword" ? "password" : "text"}
                placeholder={String(field.name).charAt(0).toUpperCase() + String(field.name).slice(1)}
                aria-invalid={fieldState.invalid ? "true" : undefined}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      ))}

      <Button
        type="submit"
        className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter text-light900!"
        disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ?
          formType === "SIGN_UP" ?
            "Signing Up..."
          : "Signing In..."
        : formType === "SIGN_UP" ?
          "Sign up"
        : "Sign in"}
      </Button>
      {formType === "SIGN_IN" ?
        <p>
          Don't have an account?{" "}
          <Link href={ROUTES.SIGN_UP} className="paragraph-semibold primary-text-gradient">
            Sign up
          </Link>
        </p>
      : <p>
          Already have an account?{" "}
          <Link href={ROUTES.SIGN_IN} className="paragraph-semibold primary-text-gradient">
            Sign in
          </Link>
        </p>
      }
    </form>
  )
}

export default AuthForm
