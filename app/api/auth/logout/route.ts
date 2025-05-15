import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 标记为动态路由，防止静态生成导致的headers错误
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 清除token cookie
    cookies().delete('token')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: '登出失败，请稍后重试' },
      { status: 500 }
    )
  }
} 