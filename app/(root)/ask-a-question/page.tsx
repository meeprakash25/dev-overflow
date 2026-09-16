import QuestionForm from '@/components/forms/QuestionForm'
import React from 'react'

const AskAQuestion = () => {
  return (
    <>
      <div className="h1-bold text-dark100_light900">QuestionForm</div>
      <div className="mt-9">
        <QuestionForm />
      </div>
    </>
  )
}

export default AskAQuestion