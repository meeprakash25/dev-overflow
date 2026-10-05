"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { toast } from "../ui/toast"
import { useRef, useState, useTransition } from "react"
import { AnswerSchema } from "@/lib/validations"
import dynamic from "next/dynamic"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { ReloadIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import { createAnswer } from "@/lib/actions/answer.action"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
})

interface AnswerFormProps {
  questionId: string
  questionTitle: string
  questionContent: string
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: AnswerFormProps) => {
  const [isAnswering, startAnsweringTransition] = useTransition()
  const [isAISubmitting, setIsAISubmitting] = useState(false)
  // const [editorResetKey, setEditorResetKey] = useState(0)
  const session = useSession()

  const editorRef = useRef<MDXEditorMethods>(null)

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { content: "" },
  })

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      })
      if (result.success) {
        form.reset()
        // setEditorResetKey((key) => key + 1)
        toast.add({
          title: "Success",
          description: "Answer posted successfully",
          type: "success",
        })
        if (editorRef.current) {
          editorRef.current.setMarkdown("")
        }
      } else {
        toast.add({
          title: "Error",
          description: result.error?.message || "Something went wrong",
          type: "error",
        })
      }
    })
  }

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast.add({
        title: "Please login",
        description: "You need to be logged in to use this feature.",
        type: "error",
      })
    }

    setIsAISubmitting(true)
    try {
      const { success, data, error } = await api.ai.getAnswer(questionTitle, questionContent)
      if (!success) {
        toast.add({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong.",
          type: "error",
        })
      }

      const formattedAnswer = data.replace(/<br\s*\/?>/gi, "\n").trim()
      if (editorRef.current) {
        editorRef.current.setMarkdown(formattedAnswer)
        form.setValue("content", formattedAnswer)
        form.trigger("content")
      }

      toast.add({
        title: "Success",
        description: "AI Answer has been generated.",
        type: "success",
      })
      
    } catch (error) {
      toast.add({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong.",
        type: "error",
      })
    } finally {
      setIsAISubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-4 pt-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-1">
        <h4 className="paragraph-semibold paragraph-medium text-dark400_light800">Write your answer here</h4>
        <Button onClick={generateAIAnswer}
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
          disabled={isAnswering}>
          {isAnswering ? "Posting..." : "Post Answer"}
        </Button>
      </div>
    </form>
  )
}

export default AnswerForm
