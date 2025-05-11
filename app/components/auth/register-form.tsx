import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      router.push("/login")
    } catch (error) {
      setError(error instanceof Error ? error.message : "注册失败，请稍后重试")
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
        <label htmlFor="name" className="text-sm font-medium">
          昵称
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

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
        {loading ? "注册中..." : "注册"}
      </Button>
    </form>
  )
} 