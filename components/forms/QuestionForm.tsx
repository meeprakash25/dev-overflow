"use client"

import { AskQuestionSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, Form, useForm } from "react-hook-form"
import { Field, FieldError, FieldLabel, FieldDescription } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import z from "zod"

const QuestionForm = () => {
  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  })

  const handleCreateQuestion = () => {
    // Handle question creation logic here
  }

  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-10" onSubmit={form.handleSubmit(handleCreateQuestion)}>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field className="flex-w-full flex-col gap-2" data-invalid={fieldState.invalid ? "true" : undefined}>
              <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="title">
                Question Title <span className="text-primary-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="title"
                className="paragraph-regular background-light800_dark300 ring-transparent light-border-2 text-dark300_light700 min-h-14 border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
                type="text"
                placeholder="Question Title"
                aria-invalid={fieldState.invalid ? "true" : undefined}
              />
              <FieldDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine that you're asking a question to another
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="content"
          render={({ field, fieldState }) => (
            <Field className="flex-w-full flex-col gap-2" data-invalid={fieldState.invalid ? "true" : undefined}>
              <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="content">
                Detailed explanation of your problem <span className="text-primary-500">*</span>
              </FieldLabel>
              Editor
              <FieldDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand what you've put in the title
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="tags"
          render={({ field, fieldState }) => (
            <Field className="flex-w-full flex-col gap-3" data-invalid={fieldState.invalid ? "true" : undefined}>
              <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="tags">
                Tags <span className="text-primary-500">*</span>
              </FieldLabel>
              <div>
                <Input
                  {...field}
                  id="tags"
                  className="paragraph-regular background-light800_dark300 ring-transparent light-border-2 text-dark300_light700 min-h-14 border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
                  type="text"
                  placeholder="Add tags"
                  aria-invalid={fieldState.invalid ? "true" : undefined}
                />
                Tags
              </div>
              <FieldDescription className="body-regular mt-2.5 text-light-500">
                Add upto 3 tags to describe what your question is about. You need to press enter to add a tag.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient !text-light900 w-fit"
            disabled={form.formState.isSubmitting}>
            Ask A Question
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default QuestionForm
