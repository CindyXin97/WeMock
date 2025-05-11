import { useAtom } from 'jotai'
import { interviewFormAtom } from '../atoms'
import { Button } from '../../components/ui/button'

const contents = [
  { label: '简历面', value: '简历面' },
  { label: '技术面', value: '技术面' },
  { label: '业务面', value: '业务面' },
  { label: '综合面', value: '综合面' },
]

export default function Step4() {
  const [form, setForm] = useAtom(interviewFormAtom)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">请选择面试内容</h2>
      <div className="space-y-4">
        {contents.map(c => (
          <Button
            key={c.value}
            variant={form.content === c.value ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setForm(f => ({ ...f, content: c.value }))}
          >
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  )
} 