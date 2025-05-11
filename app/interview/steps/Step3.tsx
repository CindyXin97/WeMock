import { useAtom } from 'jotai'
import { interviewFormAtom } from '../atoms'
import { Button } from '@/components/ui/button'

const industries = [
  { label: '互联网/科技', value: 'tech' },
  { label: '金融/银行/保险', value: 'finance' },
  { label: '零售/电商', value: 'retail' },
  { label: '医疗/健康', value: 'health' },
]

export default function Step3() {
  const [form, setForm] = useAtom(interviewFormAtom)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">请选择面试行业方向</h2>
      <div className="space-y-4">
        {industries.map(i => (
          <Button
            key={i.value}
            variant={form.industry === i.value ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setForm(f => ({ ...f, industry: i.value }))}
          >
            {i.label}
          </Button>
        ))}
      </div>
    </div>
  )
} 