import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// 需要认证的路由
const protectedRoutes = ['/profile', '/dashboard', '/matching', '/interviews']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // 输出调试信息
  console.log('Middleware checking path:', path)
  
  // 是否需要认证
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route) || path === route
  )
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }
  
  // 获取 token
  const token = request.cookies.get('token')?.value
  console.log('Token found:', !!token)
  
  // 如果没有 token，重定向到登录页
  if (!token) {
    console.log('No token, redirecting to login')
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURIComponent(request.url))
    console.log('Redirect URL:', url.toString())
    return NextResponse.redirect(url)
  }
  
  try {
    // 使用 jose 库验证 token (支持在 Edge 运行时)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    const { payload } = await jwtVerify(token, secret)
    
    console.log('Token verified successfully, decoded payload:', payload)
    console.log('Token verified, proceeding to protected route')
    return NextResponse.next()
  } catch (error) {
    // token 无效，重定向到登录页
    console.error('Token verification failed:', error)
    console.log('Invalid token, redirecting to login')
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURIComponent(request.url))
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/profile/:path*', '/dashboard/:path*', '/matching/:path*', '/interviews/:path*'],
} 