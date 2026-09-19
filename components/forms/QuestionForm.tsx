"use client"

import { AskQuestionSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldLabel, FieldDescription } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import z from "zod"
import { useRef } from "react"
import { MDXEditorMethods } from "@mdxeditor/editor"
import dynamic from "next/dynamic"
import TagCard from "../cards/TagCard"

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
})

const QuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null)
  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  })

  const handleCreateQuestion = (data: z.infer<typeof AskQuestionSchema>) => {
    console.log("Question submitted:", data)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const tagInput = e.currentTarget.value.trim()
      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput])
        e.currentTarget.value = ""
        form.clearErrors("tags")
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag should be less than 15 characters",
        })
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        })
      }
    }
  }

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag)
    form.setValue("tags", newTags)
    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleCreateQuestion)} className="flex w-full flex-col gap-10">
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field className="flex w-full flex-col gap-2" data-invalid={fieldState.invalid ? "true" : undefined}>
            <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="title">
              Question Title <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="title"
              className="paragraph-regular background-light800_dark300 ring-transparent light-border-2 text-dark300_light700 min-h-14 border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
              type="text"
              placeholder="Question Title"
              aria-invalid={fieldState.invalid}
            />
            <FieldDescription className="body-regular mt-2.5 text-light-500">
              Be specific and imagine that you're asking a question to another
            </FieldDescription>
            <FieldError className="text-red-500" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field className="flex w-full flex-col gap-2" data-invalid={fieldState.invalid ? "true" : undefined}>
            <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="content">
              Detailed explanation of your problem <span className="text-red-500">*</span>
            </FieldLabel>
            <Editor value={field.value} fieldChange={field.onChange} editorRef={editorRef} />
            <FieldDescription className="body-regular mt-2.5 text-light-500">
              Introduce the problem and expand what you've put in the title
            </FieldDescription>
            <FieldError className="text-red-500" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="tags"
        render={({ field, fieldState }) => (
          <Field className="flex w-full flex-col gap-3" data-invalid={fieldState.invalid ? "true" : undefined}>
            <FieldLabel className="paragraph-semibold text-dark400_light800" htmlFor="tags">
              Tags <span className="text-red-500">*</span>
            </FieldLabel>
            <div>
              <Input
                id="tags"
                className="paragraph-regular background-light800_dark300 ring-transparent light-border-2 text-dark300_light700 min-h-14 border aria-invalid:ring-0 aria-invalid:ring-transparent dark:aria-invalid:ring-0 dark:aria-invalid:ring-transparent"
                type="text"
                placeholder="Add tags..."
                aria-invalid={fieldState.invalid}
                onKeyDown={(e) => handleInputKeyDown(e, field)}
              />
              {field.value.length > 0 && (
                <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                  {field.value.map((tag: string) => (
                    <TagCard
                      key={tag}
                      _id={tag}
                      name={tag}
                      compact
                      remove
                      isButton
                      handleRemove={() => handleTagRemove(tag, field)}
                    />
                  ))}
                </div>
              )}
            </div>
            <FieldDescription className="body-regular mt-2.5 text-light-500">
              Add upto 3 tags to describe what your question is about. You need to press enter to add a tag.
            </FieldDescription>
            <FieldError className="text-red-500" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="mt-16 flex justify-end">
        <Button type="submit" className="primary-gradient !text-light900 w-fit" disabled={form.formState.isSubmitting}>
          Ask A Question
        </Button>
      </div>
    </form>
  )
}

export default QuestionForm
