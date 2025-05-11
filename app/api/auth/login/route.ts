import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

// 从 register 中获取用户存储
// @ts-ignore 开发环境临时方案
const userStore: Record<string, any> = global.userStore || {};
// @ts-ignore 开发环境临时方案
if (!global.userStore) global.userStore = userStore;

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // 简单示例：仅检查用户名和密码是否为非空
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 实际项目中，这里应该从数据库查询用户并验证密码
    // 这里简化为只要提供任何非空用户名和密码就通过
    
    console.log('User logged in:', { username })

    // 创建JWT令牌 - 使用jose库
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    const token = await new SignJWT({ userId: '1', username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret)

    console.log('Token created successfully')

    // 创建响应对象
    const response = NextResponse.json({ success: true })
    
    // 设置cookie到响应中
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1天
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
} 