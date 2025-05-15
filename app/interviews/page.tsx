'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'

interface Interview {
  id: number
  interviewerId: number
  intervieweeId: number
  interview_type: string
  scheduled_time: string
  status: string
  createdAt: string
  interviewer: {
    id: number
    username: string
    nickname: string | null
  }
  interviewee: {
    id: number
    username: string
    nickname: string | null
  }
}

export default function InterviewsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        // 获取用户信息
        const userResponse = await fetch('/api/auth/me')
        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('获取用户信息失败')
        }
        
        const userData = await userResponse.json()
        setCurrentUserId(userData.user.id)
        
        // 获取面试记录
        const interviewsResponse = await fetch('/api/interviews')
        if (!interviewsResponse.ok) {
          throw new Error('获取面试记录失败')
        }
        
        const interviewsData = await interviewsResponse.json()
        setInterviews(interviewsData.interviews || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载面试记录失败')
        console.error('Interviews fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchInterviews()
  }, [router])

  const formatDate = (dateString: string) => {
    if (!dateString) return '未安排'
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm')
    } catch {
      return '日期无效'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-50 text-red-500'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'pending':
        return '待确认'
      case 'scheduled':
        return '已安排'
      case 'cancelled':
        return '已取消'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded mb-8"></div>
          <p className="text-lg text-slate-500">加载面试记录中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="p-6 max-w-md">
          <h3 className="text-xl font-semibold text-red-500 mb-2">出错了</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>返回首页</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">面试记录</h1>
            <p className="mt-2 text-gray-600">查看你的面试历史和反馈</p>
          </div>
          <Button 
            onClick={() => router.push('/matching')}
          >
            寻找伙伴
          </Button>
        </div>

        {interviews.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      面试角色
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      面试伙伴
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      面试类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interviews.map((interview) => {
                    // 确定当前用户是面试官还是被面试者
                    const isInterviewer = interview.interviewerId === currentUserId
                    const partner = isInterviewer ? interview.interviewee : interview.interviewer
                    const role = isInterviewer ? '面试官' : '面试者'
                    
                    return (
                      <tr key={interview.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100">
                            {role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {partner.nickname || partner.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{interview.interview_type || '标准面试'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(interview.scheduled_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getStatusBadgeClass(interview.status)
                          }`}>
                            {getStatusText(interview.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {interview.status === 'scheduled' ? (
                            <Button variant="outline" size="sm" onClick={() => router.push(`/interview/${interview.id}`)}>
                              开始面试
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/interview/${interview.id}`)}>
                              查看详情
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">暂无面试记录</p>
            <Button onClick={() => router.push('/matching')}>
              寻找面试伙伴
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 