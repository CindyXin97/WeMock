import { useAtom } from 'jotai'
import { interviewFormAtom } from '../atoms'

export default function Step5() {
  const [form, setForm] = useAtom(interviewFormAtom)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">请选择面试时间</h2>
      <input
        type="datetime-local"
        className="w-full p-2 border rounded"
        value={form.time}
        onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
      />
    </div>
  )
} 