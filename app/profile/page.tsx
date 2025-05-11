'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const roleOptions = ['DA', 'DS', 'DE', 'Other']
const experienceOptions = ['0', '1-3', '4-5', '>5']
const practiceAreaOptions = ['SQL', 'Python算法', 'Python数据处理', 'Case Study', 'Behavior Question']

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    targetRole: '',
    workExperience: '',
    practiceAreas: [] as string[],
    targetIndustry: '',
    targetCompany: '',
    availableTime: {
      weekdays: [] as string[],
      weekends: [] as string[]
    }
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        router.push('/matches')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handlePracticeAreaChange = (area: string) => {
    setFormData(prev => ({
      ...prev,
      practiceAreas: prev.practiceAreas.includes(area)
        ? prev.practiceAreas.filter(a => a !== area)
        : [...prev.practiceAreas, area]
    }))
  }

  if (status === 'loading') {
    return <div>加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* 个人信息卡片 */}
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl">👨‍💻</div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">个人信息</h3>
                <p className="text-sm text-gray-500">管理你的个人信息和偏好设置</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">基本信息</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">姓名</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="张三"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">邮箱</label>
                    <input
                      type="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="zhangsan@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* 职业信息 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">职业信息</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">当前职位</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="数据分析师"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">工作经验</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="3年"
                    />
                  </div>
                </div>
              </div>

              {/* 技能标签 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">技能标签</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">SQL</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Python</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Tableau</span>
                  <Button variant="outline" size="sm" className="ml-2">
                    + 添加标签
                  </Button>
                </div>
              </div>

              {/* 目标设置 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">目标设置</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">目标行业</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="互联网"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">目标职位</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="高级数据分析师"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button>
                保存更改
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 