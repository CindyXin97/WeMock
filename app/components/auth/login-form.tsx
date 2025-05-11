import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "登录失败，请稍后重试")
      }

      // 登录成功后直接跳转到匹配页面
      router.push("/matching")
    } catch (error) {
      setError(error instanceof Error ? error.message : "登录失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      {error && (
        <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          邮箱
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          密码
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "登录中..." : "登录"}
      </Button>
    </form>
  )
} 