'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TimePickerDialog } from '@/components/interview/time-picker-dialog'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  name: string
  targetRole: string
  workExperience: string
  practiceAreas: string[]
  targetIndustry: string
  targetCompany: string
  matchScore?: number
  displayName?: string
}

interface Filters {
  targetRole: string
  workExperience: string
  practiceArea: string
  targetIndustry: string
}

interface ApiUser {
  id: string
  username: string
  nickname: string | null
  targetRole: string | null
  workExperience: string | null
  practiceAreas: string[]
  targetIndustry: string | null
  targetCompany: string | null
  displayName: string
}

export default function MatchesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    targetRole: '',
    workExperience: '',
    practiceArea: '',
    targetIndustry: '',
  })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/matches')
        if (response.ok) {
          const data = await response.json()
          const usersWithScores = data.map((user: ApiUser) => ({
            ...user,
            name: user.displayName || user.username,
            matchScore: calculateMatchScore(user as unknown as User, filters)
          }))
          setUsers(usersWithScores.sort((a: User, b: User) => (b.matchScore || 0) - (a.matchScore || 0)))
        }
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [filters])

  const calculateMatchScore = (user: User, filters: Filters): number => {
    let score = 0
    const weights = {
      targetRole: 0.3,
      workExperience: 0.2,
      practiceArea: 0.3,
      targetIndustry: 0.2
    }

    if (filters.targetRole && user.targetRole === filters.targetRole) {
      score += weights.targetRole * 100
    }
    if (filters.workExperience && user.workExperience === filters.workExperience) {
      score += weights.workExperience * 100
    }
    if (filters.practiceArea && user.practiceAreas.includes(filters.practiceArea)) {
      score += weights.practiceArea * 100
    }
    if (filters.targetIndustry && user.targetIndustry === filters.targetIndustry) {
      score += weights.targetIndustry * 100
    }

    return Math.round(score)
  }

  const handleRequestInterview = async (user: User) => {
    setSelectedUser(user)
    setIsTimePickerOpen(true)
  }

  const handleTimeConfirm = async (time: string) => {
    if (!selectedUser) return

    try {
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intervieweeId: selectedUser.id,
          suggestedTime: time,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: '成功',
          description: data.message || '面试请求已发送！',
          variant: 'default',
        })
      } else {
        throw new Error(data.error || '发送面试请求失败')
      }
    } catch (error) {
      console.error('Error requesting interview:', error)
      toast({
        title: '请求失败',
        description: error instanceof Error ? error.message : '发送面试请求失败，请重试',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">寻找面试官</h1>

      {/* 筛选器 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">筛选条件</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">目标岗位</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.targetRole}
              onChange={(e) => setFilters({ ...filters, targetRole: e.target.value })}
            >
              <option value="">全部</option>
              <option value="DA">数据分析师 (DA)</option>
              <option value="DS">数据科学家 (DS)</option>
              <option value="DE">数据工程师 (DE)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">工作年限</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.workExperience}
              onChange={(e) => setFilters({ ...filters, workExperience: e.target.value })}
            >
              <option value="">全部</option>
              <option value="0">应届生</option>
              <option value="1-3">1-3年</option>
              <option value="4-5">4-5年</option>
              <option value=">5">5年以上</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">练习内容</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.practiceArea}
              onChange={(e) => setFilters({ ...filters, practiceArea: e.target.value })}
            >
              <option value="">全部</option>
              <option value="SQL">SQL</option>
              <option value="Python算法">Python算法</option>
              <option value="Python数据处理">Python数据处理</option>
              <option value="Case Study">Case Study</option>
              <option value="Behavior Question">Behavior Question</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">目标行业</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.targetIndustry}
              onChange={(e) => setFilters({ ...filters, targetIndustry: e.target.value })}
            >
              <option value="">全部</option>
              <option value="互联网">互联网</option>
              <option value="金融">金融</option>
              <option value="医疗">医疗</option>
              <option value="教育">教育</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>
      </div>

      {/* 匹配列表 */}
      <div className="space-y-4">
        {users.map((user: User) => (
          <div key={user.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.targetRole} | {user.workExperience}年经验</p>
                <div className="mt-2">
                  {user.practiceAreas.map((area: string) => (
                    <span
                      key={area}
                      className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2 mb-2"
                    >
                      {area}
                    </span>
                  ))}
                </div>
                {user.targetIndustry && (
                  <p className="text-sm text-gray-500 mt-2">
                    目标行业：{user.targetIndustry}
                  </p>
                )}
                {user.targetCompany && (
                  <p className="text-sm text-gray-500">
                    目标公司：{user.targetCompany}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">
                  匹配度：{user.matchScore}%
                </p>
                <Button onClick={() => handleRequestInterview(user)}>
                  发起面试
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 时间选择对话框 */}
      <TimePickerDialog
        isOpen={isTimePickerOpen}
        onClose={() => {
          setIsTimePickerOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleTimeConfirm}
      />
    </div>
  )
} 