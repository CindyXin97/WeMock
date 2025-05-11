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
      targetRole: formData.get("targetRole") as string,
      workExperience: formData.get("workExperience") as string,
      practiceAreas: formData.getAll("practiceAreas") as string[],
      targetIndustry: formData.get("targetIndustry") as string,
      targetCompany: formData.get("targetCompany") as string,
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

      <div className="space-y-2">
        <label htmlFor="targetRole" className="text-sm font-medium">
          目标岗位
        </label>
        <select
          id="targetRole"
          name="targetRole"
          required
          className="w-full p-2 border rounded-md"
        >
          <option value="">请选择目标岗位</option>
          <option value="DA">数据分析师 (DA)</option>
          <option value="DS">数据科学家 (DS)</option>
          <option value="DE">数据工程师 (DE)</option>
          <option value="Other">其他数据相关岗位</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="workExperience" className="text-sm font-medium">
          工作年限
        </label>
        <select
          id="workExperience"
          name="workExperience"
          required
          className="w-full p-2 border rounded-md"
        >
          <option value="">请选择工作年限</option>
          <option value="0">应届生</option>
          <option value="1-3">1-3年</option>
          <option value="4-5">4-5年</option>
          <option value=">5">5年以上</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">练习内容</label>
        <div className="space-y-2">
          {["SQL", "Python算法", "Python数据处理", "Case Study", "Behavior Question"].map(
            (area) => (
              <label key={area} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="practiceAreas"
                  value={area}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{area}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="targetIndustry" className="text-sm font-medium">
          目标行业
        </label>
        <input
          id="targetIndustry"
          name="targetIndustry"
          type="text"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="targetCompany" className="text-sm font-medium">
          目标公司
        </label>
        <input
          id="targetCompany"
          name="targetCompany"
          type="text"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "注册中..." : "注册"}
      </Button>
    </form>
  )
} 