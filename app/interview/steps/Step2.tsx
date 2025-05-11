import { useAtom } from 'jotai'
import { interviewFormAtom } from '../atoms'
import { Button } from '@/components/ui/button'

const roles = [
  { label: '数据科学家DS', value: 'DS' },
  { label: '数据分析师DA', value: 'DA' },
  { label: '商业分析师BA', value: 'BA' },
]

export default function Step2() {
  const [form, setForm] = useAtom(interviewFormAtom)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">请选择求职岗位</h2>
      <div className="space-y-4">
        {roles.map(r => (
          <Button
            key={r.value}
            variant={form.jobRole === r.value ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setForm(f => ({ ...f, jobRole: r.value }))}
          >
            {r.label}
          </Button>
        ))}
      </div>
    </div>
  )
} 