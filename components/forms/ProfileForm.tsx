"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import ROUTES from "@/constants/routes"
import { updateUser } from "@/lib/actions/user.action"
import { ProfileSchema } from "@/lib/validations"

import { Textarea } from "../ui/textarea"
import { toast } from "../ui/toast"

interface Params {
  user: User
}

const ProfileForm = ({ user }: Params) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      portfolio: user.portfolio || "",
      location: user.location || "",
      bio: user.bio || "",
    },
  })

  const handleUpdateProfile = async (values: z.infer<typeof ProfileSchema>) => {
    startTransition(async () => {
      const result = await updateUser({
        ...values,
      })

      if (result.success) {
        toast.add({
          title: "Success",
          description: "Your profile has been updated successfully.",
        })

        router.push(ROUTES.PROFILE(user._id))
      } else {
        toast.add({
          title: `Error (${result.status})`,
          description: result.error?.message,
          type: "error",
        })
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="mt-9 flex w-full flex-col gap-9">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field className="flex-col gap-3.5" data-invalid={fieldState.invalid ? "true" : undefined}>
            <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="name">
              Name <span className="text-primary-500">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="name"
              aria-invalid={fieldState.invalid}
              className="paragraph-regular ring-transparent light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
              placeholder="Your Name"
            />
            <FieldError className="text-red-500" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="username"
        render={({ field, fieldState }) => (
          <Field className="flex-col gap-3.5" data-invalid={fieldState.invalid ? "true" : undefined}>
            <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="username">
              Username <span className="text-primary-500">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="username"
              aria-invalid={fieldState.invalid}
              className="paragraph-regular ring-transparent light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
              placeholder="Your username"
            />
            <FieldError className="text-red-500" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="portfolio"
        render={({ field, fieldState }) => (
          <Field className="flex-col gap-3.5" data-invalid={fieldState.invalid ? "true" : undefined}>
            <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="portfolio">
              Portfolio Link
            </FieldLabel>
            <Input
              {...field}
              id="portfolio"
              type="url"
              aria-invalid={fieldState.invalid}
              className="paragraph-regular light-border-2 ring-transparent background-light800_dark300 text-dark300_light700 min-h-[56px] border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
              placeholder="Your Portfolio link"
            />
            <FieldError className="text-red-500" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="location"
        render={({ field, fieldState }) => (
          <Field className="flex-col gap-3.5" data-invalid={fieldState.invalid ? "true" : undefined}>
            <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="location">
              Location
            </FieldLabel>
            <Input
              {...field}
              id="location"
              aria-invalid={fieldState.invalid}
              className="paragraph-regular ring-transparent light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
              placeholder="Where do you live?"
            />
            <FieldError className="text-red-500" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="bio"
        render={({ field, fieldState }) => (
          <Field className="flex-col gap-3.5" data-invalid={fieldState.invalid ? "true" : undefined}>
            <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="bio">
              Bio
            </FieldLabel>
            <Textarea
              {...field}
              id="bio"
              rows={5}
              aria-invalid={fieldState.invalid}
              className="field-sizing-fixed paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 ring-transparent border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
              placeholder="What's special about you?"
            />
            <FieldError className="text-red-500" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="mt-7 flex justify-end">
        <Button type="submit" className="primary-gradient w-fit" disabled={isPending}>
          {isPending ?
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          : <>Submit</>}
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm
