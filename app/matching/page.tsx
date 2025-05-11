'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface UserProfile {
  id: number
  username: string
  nickname?: string
  targetRole?: string
  workExperience?: string
  practiceAreas?: string[]
  targetIndustry?: string
  targetCompany?: string
  availableTimes?: {
    weekdays: string[]
    weekends: string[]
  }
  matchScore?: number
}

export default function MatchingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  // 过滤选项
  const [filters, setFilters] = useState({
    targetRole: '',
    workExperience: '',
    practiceArea: '',
  })

  useEffect(() => {
    // 获取用户信息和匹配
    const fetchData = async () => {
      try {
        // 获取当前用户资料
        const meResponse = await fetch('/api/auth/me')
        
        if (!meResponse.ok) {
          if (meResponse.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('获取用户信息失败')
        }
        
        const meData = await meResponse.json()
        setUserProfile(meData.user)
        
        // 获取匹配用户列表
        const matchesResponse = await fetch('/api/matching')
        
        if (!matchesResponse.ok) {
          throw new Error('获取匹配列表失败')
        }
        
        const matchesData = await matchesResponse.json()
        setUsers(matchesData.users)
        setFilteredUsers(matchesData.users)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载匹配信息失败')
        console.error('Matching fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [router])
  
  // 应用过滤器
  useEffect(() => {
    if (!users.length) return
    
    const filtered = users.filter(user => {
      return (
        (filters.targetRole ? user.targetRole === filters.targetRole : true) &&
        (filters.workExperience ? user.workExperience === filters.workExperience : true) &&
        (filters.practiceArea ? user.practiceAreas?.includes(filters.practiceArea) : true)
      )
    })
    
    setFilteredUsers(filtered)
  }, [filters, users])
  
  // 发送匹配请求
  const handleRequestMatch = async (userId: number) => {
    try {
      const response = await fetch('/api/matching/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId: userId }),
      })
      
      if (!response.ok) {
        throw new Error('发送匹配请求失败')
      }
      
      toast({
        title: "请求已发送",
        description: "匹配请求已成功发送！",
      })
    } catch (error) {
      console.error('匹配请求错误:', error)
      toast({
        variant: "destructive",
        title: "请求失败",
        description: "发送匹配请求失败，请重试",
      })
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded mb-8"></div>
          <p className="text-lg text-slate-500">加载匹配列表中...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-red-500">出错了</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/')}>返回首页</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">寻找匹配伙伴</h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/profile')}
              className="text-sm"
            >
              {userProfile?.targetRole ? '编辑个人资料' : '完善个人资料'}
            </Button>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              已找到 {filteredUsers.length} 位可匹配伙伴
            </Badge>
          </div>
        </div>
        
        {!userProfile?.targetRole && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-blue-800">
                  完善您的个人资料可以提高匹配度，帮助您找到更合适的练习伙伴。
                  <Button 
                    variant="link" 
                    onClick={() => router.push('/profile')}
                    className="text-blue-600 font-medium p-0 h-auto"
                  >
                    立即完善
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 侧边过滤器 */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">过滤条件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-role">目标岗位</Label>
                  <select
                    id="filter-role"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={filters.targetRole}
                    onChange={(e) => setFilters({...filters, targetRole: e.target.value})}
                  >
                    <option value="">全部</option>
                    <option value="DA">DA</option>
                    <option value="DS">DS</option>
                    <option value="DE">DE</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filter-experience">工作经验</Label>
                  <select
                    id="filter-experience"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={filters.workExperience}
                    onChange={(e) => setFilters({...filters, workExperience: e.target.value})}
                  >
                    <option value="">全部</option>
                    <option value="0">0年</option>
                    <option value="1-3">1-3年</option>
                    <option value="4-5">4-5年</option>
                    <option value=">5">5年以上</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filter-practice">练习内容</Label>
                  <select
                    id="filter-practice"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={filters.practiceArea}
                    onChange={(e) => setFilters({...filters, practiceArea: e.target.value})}
                  >
                    <option value="">全部</option>
                    <option value="SQL">SQL</option>
                    <option value="Python算法">Python算法</option>
                    <option value="Python数据处理">Python数据处理</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Behavior Question">Behavior Question</option>
                  </select>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setFilters({ targetRole: '', workExperience: '', practiceArea: '' })}
                >
                  重置筛选
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* 匹配列表 */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-lg">
                          {user.nickname || user.username}
                        </div>
                        <Badge variant="secondary" className="px-3 py-1 text-blue-700">
                          匹配度: {user.matchScore || '80'}%
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-500">目标岗位: </span>
                          <Badge variant="outline" className="ml-1">
                            {user.targetRole || '未设置'}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-slate-500">工作经验: </span>
                          <Badge variant="outline" className="ml-1">
                            {user.workExperience || '未设置'}年
                          </Badge>
                        </div>
                        <div className="col-span-2 mt-2">
                          <span className="text-slate-500 block mb-1">练习内容: </span>
                          <div className="flex flex-wrap gap-1">
                            {user.practiceAreas && user.practiceAreas.length > 0 ? 
                              user.practiceAreas.map(area => (
                                <Badge key={area} variant="secondary" className="mr-1 mb-1">
                                  {area}
                                </Badge>
                              )) : 
                              <span className="text-slate-400">未设置</span>
                            }
                          </div>
                        </div>
                        <div className="col-span-2 mt-2">
                          <span className="text-slate-500">目标行业: </span>
                          <span>{user.targetIndustry || '未设置'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500 block mb-1">可用时间: </span>
                          <div className="text-xs">
                            {user.availableTimes?.weekdays?.length ? 
                              <div className="mb-1">
                                <Badge variant="outline" className="mr-1">工作日</Badge> 
                                {user.availableTimes.weekdays.join(', ')}
                              </div> : ''}
                            {user.availableTimes?.weekends?.length ? 
                              <div>
                                <Badge variant="outline" className="mr-1">周末</Badge> 
                                {user.availableTimes.weekends.join(', ')}
                              </div> : ''}
                            {(!user.availableTimes?.weekdays?.length && !user.availableTimes?.weekends?.length) ? 
                              <span className="text-slate-400">未设置</span> : ''}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-3">
                      <Button 
                        onClick={() => handleRequestMatch(user.id)}
                        size="sm"
                        className="px-4"
                      >
                        申请匹配
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col justify-center items-center h-40 border rounded-lg bg-slate-50 p-6">
                  <p className="text-slate-500 mb-4">没有找到匹配的用户</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({ targetRole: '', workExperience: '', practiceArea: '' })}
                    size="sm"
                  >
                    清除筛选条件
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 