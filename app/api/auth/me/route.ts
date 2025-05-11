import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { query } from '@/lib/database'

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
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number, username: string }
    
    // 查询用户信息 - 使用参数化查询防SQL注入
    const users = await query<any>(
      `SELECT 
        id, username, 
        contact_info as "contactInfo",
        target_role as "targetRole", 
        work_experience as "workExperience", 
        practice_areas as "practiceAreas", 
        target_industry as "targetIndustry", 
        target_company as "targetCompany",
        available_times as "availableTimes"
      FROM users 
      WHERE id = $1`,
      [decoded.userId]
    )
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }
    
    // 返回用户信息
    return NextResponse.json({
      user: users[0]
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: '身份验证失败' },
      { status: 401 }
    )
  }
} 