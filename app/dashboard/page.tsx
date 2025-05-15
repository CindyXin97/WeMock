'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

// 定义数据类型
type User = {
  id: number
  username: string
  nickname: string | null
  displayName: string
  targetRole: string | null
  workExperience: string | null
  practiceAreas: string[]
  targetIndustry: string | null
  targetCompany: string | null
  matchScore?: number
}

// 修改面试数据类型以匹配API返回
type ApiInterview = {
  id: number
  scheduled_time: string | null
  status: string | null
  interview_type: string | null
  interviewerId: number
  intervieweeId: number
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

type Interview = {
  id: number
  scheduled_time: string | null
  status: string | null
  interview_type: string | null
  interviewerId: number
  intervieweeId: number
  interviewer: {
    id: number
    username: string
    nickname: string | null
    displayName: string
  }
  interviewee: {
    id: number
    username: string
    nickname: string | null
    displayName: string
  }
  isCurrentUserInterviewer: boolean
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<User[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState({
    matches: true,
    interviews: true
  })
  const [error, setError] = useState({
    matches: '',
    interviews: ''
  })
  const { toast } = useToast()
  
  // 获取匹配列表
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(prev => ({ ...prev, matches: true }))
        const response = await fetch('/api/matching/list')
        
        if (!response.ok) {
          throw new Error('获取匹配列表失败')
        }
        
        const data = await response.json()
        setMatches(data.users || [])
      } catch (err) {
        setError(prev => ({ ...prev, matches: err instanceof Error ? err.message : '未知错误' }))
        toast({
          title: '错误',
          description: '获取匹配列表失败，请稍后重试',
          variant: 'destructive'
        })
      } finally {
        setLoading(prev => ({ ...prev, matches: false }))
      }
    }
    
    fetchMatches()
  }, [toast])
  
  // 获取面试列表
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(prev => ({ ...prev, interviews: true }))
        const response = await fetch('/api/interviews')
        
        if (!response.ok) {
          throw new Error('获取面试列表失败')
        }
        
        const data = await response.json()
        // 修复: 访问正确的数据结构
        const formattedInterviews = (data.interviews || []).map((interview: ApiInterview) => {
          // 确保 interviewer 和 interviewee 有 displayName
          const interviewer = {
            ...interview.interviewer,
            displayName: interview.interviewer?.nickname || interview.interviewer?.username || '未知用户'
          }
          
          const interviewee = {
            ...interview.interviewee,
            displayName: interview.interviewee?.nickname || interview.interviewee?.username || '未知用户'
          }
          
          // 从 cookie 中获取当前用户 ID
          const token = document.cookie.split('; ').find(row => row.startsWith('token='))
          // 默认当前用户是被面试者（如果无法确定）
          let isCurrentUserInterviewer = false
          
          // 检查当前用户是否是面试官
          if (token) {
            try {
              // 简单对比 ID 来确定角色（更完整的实现应通过 API 或 state 获取用户信息）
              isCurrentUserInterviewer = interview.interviewerId === interviewer.id
            } catch (e) {
              console.error('Error determining user role:', e)
            }
          }
          
          return {
            ...interview,
            interviewer,
            interviewee,
            isCurrentUserInterviewer
          }
        })
        
        setInterviews(formattedInterviews)
      } catch (err) {
        setError(prev => ({ ...prev, interviews: err instanceof Error ? err.message : '未知错误' }))
        toast({
          title: '错误',
          description: '获取面试列表失败，请稍后重试',
          variant: 'destructive'
        })
      } finally {
        setLoading(prev => ({ ...prev, interviews: false }))
      }
    }
    
    fetchInterviews()
  }, [toast])
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">仪表盘</h1>
      
      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="matches">匹配</TabsTrigger>
          <TabsTrigger value="interviews">面试</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading.matches ? (
              // 加载状态
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-slate-200 rounded-md mb-2 w-32"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-48"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-slate-200 rounded-md mb-2 w-full"></div>
                    <div className="h-4 bg-slate-200 rounded-md mb-2 w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : error.matches ? (
              <div className="col-span-full text-center text-red-500">
                {error.matches}
              </div>
            ) : matches.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">
                暂无匹配数据
              </div>
            ) : (
              matches.map(match => (
                <Card key={match.id}>
                  <CardHeader>
                    <CardTitle>{match.displayName}</CardTitle>
                    <CardDescription>
                      匹配度: {match.matchScore}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">目标岗位: {match.targetRole || '未设置'}</p>
                      <p className="text-sm">工作经验: {match.workExperience || '未设置'}</p>
                      <p className="text-sm">目标行业: {match.targetIndustry || '未设置'}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {match.practiceAreas?.map(area => (
                          <span key={area} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="interviews">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading.interviews ? (
              // 加载状态
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-slate-200 rounded-md mb-2 w-32"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-48"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-slate-200 rounded-md mb-2 w-full"></div>
                    <div className="h-4 bg-slate-200 rounded-md mb-2 w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : error.interviews ? (
              <div className="col-span-full text-center text-red-500">
                {error.interviews}
              </div>
            ) : interviews.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">
                暂无面试数据
              </div>
            ) : (
              interviews.map(interview => (
                <Card key={interview.id}>
                  <CardHeader>
                    <CardTitle>
                      {interview.isCurrentUserInterviewer ? '我面试' : '我被面试'}
                    </CardTitle>
                    <CardDescription>
                      {interview.interview_type} - {interview.status}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        {interview.isCurrentUserInterviewer ? '面试对象' : '面试官'}:&nbsp;
                        {interview.isCurrentUserInterviewer 
                          ? interview.interviewee.displayName 
                          : interview.interviewer.displayName}
                      </p>
                      <p className="text-sm">
                        时间: {interview.scheduled_time 
                          ? new Date(interview.scheduled_time).toLocaleString()
                          : '未安排'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 