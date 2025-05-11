import { useAtom } from 'jotai'
import { interviewFormAtom } from '../atoms'
import { Button } from '../../components/ui/button'

const industries = [
  { label: '互联网', value: '互联网' },
  { label: '金融', value: '金融' },
  { label: '咨询', value: '咨询' },
  { label: '制造业', value: '制造业' },
  { label: '其他', value: '其他' },
]

export default function Step3() {
  const [form, setForm] = useAtom(interviewFormAtom)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">请选择行业类型</h2>
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