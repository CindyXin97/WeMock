import { cn } from '@/lib/utils'

const steps = [
  '面试形式',
  '求职岗位',
  '行业类型',
  '面试内容',
  '选择时间',
]

export default function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((label, idx) => (
        <div key={label} className="flex-1 flex flex-col items-center">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center font-bold',
            idx <= current ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          )}>{idx + 1}</div>
          <span className="mt-2 text-sm whitespace-nowrap">{label}</span>
          {idx < steps.length - 1 && (
            <div className="h-1 w-full bg-gray-300 mt-2" />
          )}
        </div>
      ))}
    </div>
  )
} 