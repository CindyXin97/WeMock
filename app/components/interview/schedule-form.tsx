import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ScheduleFormProps {
  interviewerId: string
  interviewerName: string
}

export function ScheduleForm({ interviewerId, interviewerName }: ScheduleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      type: formData.get("type") as string,
      scheduledAt: formData.get("scheduledAt") as string,
      interviewerId,
    }

    try {
      const response = await fetch("/api/interview/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      router.push("/interview/success")
    } catch (error) {
      setError(error instanceof Error ? error.message : "预约失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          面试类型
        </label>
        <select
          id="type"
          name="type"
          required
          className="w-full p-2 border rounded-md"
        >
          <option value="">请选择面试类型</option>
          <option value="SQL">SQL</option>
          <option value="Python算法">Python算法</option>
          <option value="Python数据处理">Python数据处理</option>
          <option value="Case Study">Case Study</option>
          <option value="Behavior Question">Behavior Question</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="scheduledAt" className="text-sm font-medium">
          面试时间
        </label>
        <input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="text-sm text-gray-500">
        <p>面试官：{interviewerName}</p>
        <p className="mt-1">
          注意：预约成功后，系统会自动发送面试官的联系方式到您的邮箱
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "提交中..." : "确认预约"}
      </Button>
    </form>
  )
} 