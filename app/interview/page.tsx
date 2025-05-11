'use client'
import { useAtom } from 'jotai'
import { interviewStepAtom, interviewFormAtom } from './atoms'
import Stepper from './stepper'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import { useState } from 'react'

const steps = [Step1, Step2, Step3, Step4, Step5]

export default function InterviewPage() {
  const [step, setStep] = useAtom(interviewStepAtom)
  const [form] = useAtom(interviewFormAtom)
  const [submitted, setSubmitted] = useState(false)

  const StepComponent = steps[step]

  function handlePrev() {
    setStep(s => Math.max(0, s - 1))
  }
  function handleNext() {
    setStep(s => Math.min(steps.length - 1, s + 1))
  }
  function handleSubmit() {
    setSubmitted(true)
    // 这里可以调用API提交form数据
    // fetch('/api/interview', { method: 'POST', body: JSON.stringify(form) })
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-4">提交成功！</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(form, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow mt-8">
      <Stepper current={step} />
      <StepComponent />
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          disabled={step === 0}
        >
          上一步
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            下一步
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            提交
          </button>
        )}
      </div>
    </div>
  )
} 