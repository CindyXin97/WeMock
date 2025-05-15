import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// 标记为动态路由，防止静态生成导致的headers错误
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { username, password, nickname } = await request.json()

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 409 }
      )
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nickname: nickname || null,
        practiceAreas: [],
        available_times: {}
      },
    })

    // 返回用户信息（不包括密码）
    const { password: _, ...userWithoutPassword } = newUser
    
    return NextResponse.json({
      user: {
        ...userWithoutPassword,
        displayName: newUser.nickname || newUser.username
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 