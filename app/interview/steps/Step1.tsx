import { useAtom } from 'jotai'
import { interviewFormAtom } from '../atoms'
import { Button } from '@/components/ui/button'

const types = [
  { label: '结构化面试', value: 'structured' },
  { label: '非结构化面试', value: 'unstructured' },
  { label: '行为面试', value: 'behavioral' },
]

export default function Step1() {
  const [form, setForm] = useAtom(interviewFormAtom)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">请选择面试形式</h2>
      <div className="space-y-4">
        {types.map(t => (
          <Button
            key={t.value}
            variant={form.interviewType === t.value ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setForm(f => ({ ...f, interviewType: t.value }))}
          >
            {t.label}
          </Button>
        ))}
      </div>
    </div>
  )
} 