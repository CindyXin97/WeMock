import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// 需要认证的路由
const protectedRoutes = ['/profile', '/dashboard', '/matching', '/interviews']

// 标记为动态路由，防止静态生成导致的headers错误
export const dynamic = 'force-dynamic'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // 如果是API路由，直接放行
  if (path.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // 是否需要认证
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route) || path === route
  )
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }
  
  // 获取 token
  const token = request.cookies.get('token')?.value
  
  // 如果没有 token，重定向到登录页
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURIComponent(request.url))
    return NextResponse.redirect(url)
  }
  
  try {
    // 使用 jose 库验证 token (支持在 Edge 运行时)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    const { payload } = await jwtVerify(token, secret)
    
    return NextResponse.next()
  } catch (error) {
    // token 无效，重定向到登录页
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURIComponent(request.url))
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/profile/:path*', 
    '/dashboard/:path*', 
    '/matching/:path*', 
    '/interviews/:path*',
    '/api/:path*'
  ],
} 