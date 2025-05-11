import { useAtom } from 'jotai'
import { interviewFormAtom } from '../atoms'

export default function Step5() {
  const [form] = useAtom(interviewFormAtom)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">确认您的选择</h2>
      <div className="space-y-2 text-gray-700">
        <p>面试形式: <span className="font-medium">{form.interviewType}</span></p>
        <p>求职岗位: <span className="font-medium">{form.jobRole}</span></p>
        <p>行业方向: <span className="font-medium">{form.industry}</span></p>
        <p>面试内容: <span className="font-medium">{form.content}</span></p>
        <p>面试时长: <span className="font-medium">{form.time}分钟</span></p>
      </div>
    </div>
  )
} 