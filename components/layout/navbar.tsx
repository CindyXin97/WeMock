"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, User, LogOut } from 'lucide-react'

type User = {
  username: string;
  nickname?: string;
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // 检查是否已登录
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/auth/me', {
          // 添加缓存控制，确保获取最新状态
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setIsLoggedIn(true)
        } else {
          // API错误时清除状态
          setUser(null)
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [pathname]) // 添加pathname作为依赖，确保路由变化时重新检查
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        setIsLoggedIn(false)
        setUser(null)
        router.push('/')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // 获取用户名首字母或默认头像
  const getInitials = () => {
    if (user?.nickname) {
      return user.nickname.charAt(0).toUpperCase()
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // 检查当前路由是否活跃
  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">WeMock</span>
        </Link>

        {/* 桌面导航 */}
        <nav className="mx-6 hidden items-center space-x-4 md:flex md:flex-1">
          {isLoggedIn && (
            <>
              <Link href="/matching" className={`text-sm font-medium transition-colors ${isActive('/matching') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                寻找伙伴
              </Link>
              <Link href="/interviews" className={`text-sm font-medium transition-colors ${isActive('/interviews') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                面试记录
              </Link>
              <Link href="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                仪表盘
              </Link>
            </>
          )}
        </nav>

        {/* 桌面操作区 */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLoading ? (
            // 加载状态
            <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse"></div>
          ) : !isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">登录</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">注册</Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.nickname || user?.username} />
                      <AvatarFallback className="bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.nickname && <p className="font-medium">{user.nickname}</p>}
                      <p className="text-sm text-muted-foreground">{user?.username}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>个人资料</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* 移动端菜单 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="flex flex-col gap-4 px-2">
                {isLoading ? (
                  // 加载状态
                  <div className="flex items-center justify-center py-8">
                    <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse"></div>
                  </div>
                ) : !isLoggedIn ? (
                  <div className="flex flex-col gap-2 py-4">
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-start">登录</Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full justify-start">注册</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 border-b pb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user?.nickname || user?.username} />
                        <AvatarFallback className="bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div>
                        {user?.nickname && <p className="font-medium">{user.nickname}</p>}
                        <p className="text-sm text-muted-foreground">{user?.username}</p>
                      </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                      <Link href="/matching" className="text-sm font-medium transition-colors">
                        寻找伙伴
                      </Link>
                      <Link href="/interviews" className="text-sm font-medium transition-colors">
                        面试记录
                      </Link>
                      <Link href="/dashboard" className="text-sm font-medium transition-colors">
                        仪表盘
                      </Link>
                      <Link href="/profile" className="text-sm font-medium transition-colors">
                        个人资料
                      </Link>
                    </nav>
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                      className="mt-4"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      退出登录
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 