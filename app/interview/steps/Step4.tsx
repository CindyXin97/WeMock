import { useAtom } from 'jotai'
import { interviewFormAtom } from '../atoms'
import { Button } from '@/components/ui/button'

const times = [
  { label: '15分钟', value: '15' },
  { label: '30分钟', value: '30' },
  { label: '45分钟', value: '45' },
  { label: '60分钟', value: '60' },
]

export default function Step4() {
  const [form, setForm] = useAtom(interviewFormAtom)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">请选择面试时长</h2>
      <div className="space-y-4">
        {times.map(t => (
          <Button
            key={t.value}
            variant={form.time === t.value ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setForm(f => ({ ...f, time: t.value }))}
          >
            {t.label}
          </Button>
        ))}
      </div>
    </div>
  )
} 