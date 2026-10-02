"use client"

import { Controller, DefaultValues, FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { toast } from "../ui/toast"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { AnswerSchema } from "@/lib/validations"
import dynamic from "next/dynamic"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { ReloadIcon } from "@radix-ui/react-icons"
import Image from "next/image"

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
})

interface AuthFormProps<T extends FieldValues> {
  content?: string
  questionId?: string
}

const AnswerForm = <T extends FieldValues>({ content, questionId }: AuthFormProps<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAISubmitting, setIsAISubmitting] = useState(false)

  const editorRef = useRef<MDXEditorMethods>(null)

  const router = useRouter()
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { content: content || "", questionId: questionId || "" },
  })

  const handleSubmit: SubmitHandler<z.infer<typeof AnswerSchema>> = async (values) => {
    console.log("Values:", values)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-4 pt-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-1">
        <h4 className="paragraph-semibold paragraph-medium text-dark400_light800">Write your answer here</h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}>
          {isAISubmitting ?
            <>
              <ReloadIcon className="animate-spin mr-2 size-4" /> Generating answer...
            </>
          : <>
              <Image src="/icons/stars.svg" alt="robot icon" width={16} height={16} className="object-contain" />{" "}
              Generate with AI
            </>
          }
        </Button>
      </div>
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex-w-full flex-col gap-2" data-invalid={fieldState.invalid ? "true" : undefined}>
            <Editor value={field.value} fieldChange={field.onChange} editorRef={editorRef} />
            <FieldError className="text-red-500" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          className="primary-gradient paragraph-medium min-h-10 rounded-2 px-4 py-2 font-inter text-light-900!"
          disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Posting..." : "Post Answer"}
        </Button>
      </div>
    </form>
  )
}

export default AnswerForm
