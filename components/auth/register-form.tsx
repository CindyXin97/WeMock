import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    targetRole: '',
    workExperience: '',
    practiceAreas: [] as string[],
    targetIndustry: '',
    targetCompany: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          姓名
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="targetRole" className="block text-sm font-medium">
          目标岗位
        </label>
        <select
          id="targetRole"
          value={formData.targetRole}
          onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">请选择</option>
          <option value="DA">数据分析师 (DA)</option>
          <option value="DS">数据科学家 (DS)</option>
          <option value="DE">数据工程师 (DE)</option>
          <option value="Other">其他数据相关岗位</option>
        </select>
      </div>

      <div>
        <label htmlFor="workExperience" className="block text-sm font-medium">
          工作年限
        </label>
        <select
          id="workExperience"
          value={formData.workExperience}
          onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">请选择</option>
          <option value="0">应届生</option>
          <option value="1-3">1-3年</option>
          <option value="4-5">4-5年</option>
          <option value=">5">5年以上</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">练习内容</label>
        <div className="space-y-2">
          {['SQL', 'Python算法', 'Python数据处理', 'Case Study', 'Behavior Question'].map((area) => (
            <label key={area} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.practiceAreas.includes(area)}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...formData.practiceAreas, area]
                    : formData.practiceAreas.filter(a => a !== area)
                  setFormData({ ...formData, practiceAreas: newAreas })
                }}
                className="mr-2"
              />
              <span>{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="targetIndustry" className="block text-sm font-medium">
          目标行业
        </label>
        <input
          type="text"
          id="targetIndustry"
          value={formData.targetIndustry}
          onChange={(e) => setFormData({ ...formData, targetIndustry: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="例如：互联网、金融、医疗等"
        />
      </div>

      <div>
        <label htmlFor="targetCompany" className="block text-sm font-medium">
          目标公司
        </label>
        <input
          type="text"
          id="targetCompany"
          value={formData.targetCompany}
          onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="例如：字节跳动、阿里巴巴等"
        />
      </div>

      <Button type="submit" className="w-full">
        注册
      </Button>
    </form>
  )
} 