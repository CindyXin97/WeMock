import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

// 标记为动态路由，防止静态生成导致的headers错误
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 获取 cookie 中的 token
    const cookies = req.headers.get('cookie')
    if (!cookies) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 解析 cookie 获取 token
    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='))
    if (!tokenCookie) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const token = tokenCookie.split('=')[1]
    
    // 验证 token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.id as number
    
    // 查询用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        nickname: true,
        contact_info: true,
        targetRole: true,
        workExperience: true,
        practiceAreas: true,
        targetIndustry: true,
        targetCompany: true,
        available_times: true,
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }
    
    // 返回用户信息
    return NextResponse.json({
      user: {
        ...user,
        contactInfo: user.contact_info,
        displayName: user.nickname || user.username
      }
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: '身份验证失败' },
      { status: 401 }
    )
  }
} 