import { atom } from 'jotai'

export const interviewFormAtom = atom({
  interviewType: '',
  jobRole: '',
  industry: '',
  content: '',
  time: ''
})

export const interviewStepAtom = atom(0) 