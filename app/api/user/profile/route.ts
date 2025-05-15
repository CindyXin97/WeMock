import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { query, withTransaction } from '@/lib/database'

// 标记为动态路由，防止静态生成导致的headers错误
export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
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
    
    // 获取请求体
    const { nickname, contactInfo, targetRole, workExperience, practiceAreas, targetIndustry, targetCompany, availableTimes } = await req.json()
    
    // 更新用户信息 - 使用事务
    const updatedUser = await withTransaction(async (client) => {
      // 转换JSON对象为PostgreSQL JSONB
      const availableTimesJson = availableTimes ? JSON.stringify(availableTimes) : null
      
      const result = await client.query(
        `UPDATE users 
        SET 
          nickname = $1,
          contact_info = $2,
          target_role = $3, 
          work_experience = $4, 
          practice_areas = $5, 
          target_industry = $6, 
          target_company = $7,
          available_times = $8,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING id, username, 
                  nickname,
                  contact_info as "contactInfo",
                  target_role as "targetRole", 
                  work_experience as "workExperience", 
                  practice_areas as "practiceAreas", 
                  target_industry as "targetIndustry", 
                  target_company as "targetCompany",
                  available_times as "availableTimes"`,
        [
          nickname || null,
          contactInfo || null,
          targetRole || null, 
          workExperience || null, 
          practiceAreas || [], 
          targetIndustry || null, 
          targetCompany || null,
          availableTimesJson,
          decoded.userId
        ]
      )
      
      return result.rows[0]
    })
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }
    
    // 返回更新后的用户信息
    return NextResponse.json({
      message: '个人信息更新成功',
      user: updatedUser
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: '更新个人信息失败' },
      { status: 500 }
    )
  }
} 