import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { sql } from '@/lib/db'

// 标记为动态路由，防止静态生成导致的headers错误
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
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
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: number, username: string }
    
    // 获取请求体
    const { targetUserId } = await req.json()
    
    if (!targetUserId) {
      return NextResponse.json(
        { error: '缺少目标用户ID' },
        { status: 400 }
      )
    }
    
    // 检查是否已存在匹配
    const existingMatches = await sql`
      SELECT id, status 
      FROM matches 
      WHERE 
        (user_id_1 = ${decoded.id} AND user_id_2 = ${targetUserId})
        OR
        (user_id_1 = ${targetUserId} AND user_id_2 = ${decoded.id})
    `
    
    if (existingMatches.length > 0) {
      const match = existingMatches[0]
      
      // 如果已经存在匹配请求，返回相应状态
      if (match.status === 'pending') {
        return NextResponse.json(
          { message: '匹配请求已存在，等待对方回应' },
          { status: 200 }
        )
      }
      
      if (match.status === 'accepted') {
        return NextResponse.json(
          { message: '已经匹配成功' },
          { status: 200 }
        )
      }
      
      if (match.status === 'rejected') {
        // 如果之前被拒绝，更新状态为待定
        await sql`
          UPDATE matches 
          SET status = 'pending', updated_at = CURRENT_TIMESTAMP
          WHERE id = ${match.id}
        `
        
        return NextResponse.json(
          { message: '匹配请求已发送' },
          { status: 200 }
        )
      }
    }
    
    // 计算匹配得分
    // 获取当前用户信息
    const currentUser = await sql`
      SELECT 
        target_role as "targetRole", 
        work_experience as "workExperience", 
        practice_areas as "practiceAreas"
      FROM users 
      WHERE id = ${decoded.id}
    `
    
    // 获取目标用户信息
    const targetUser = await sql`
      SELECT 
        target_role as "targetRole", 
        work_experience as "workExperience", 
        practice_areas as "practiceAreas"
      FROM users 
      WHERE id = ${targetUserId}
    `
    
    if (targetUser.length === 0) {
      return NextResponse.json(
        { error: '目标用户不存在' },
        { status: 404 }
      )
    }
    
    // 计算匹配度
    let score = 0
    const currentUserData = currentUser[0]
    const targetUserData = targetUser[0]
    
    // 目标岗位匹配
    if (targetUserData.targetRole && currentUserData.targetRole && targetUserData.targetRole === currentUserData.targetRole) {
      score += 30
    }
    
    // 工作经验匹配（相近经验）
    if (targetUserData.workExperience && currentUserData.workExperience) {
      if (targetUserData.workExperience === currentUserData.workExperience) {
        score += 20
      } else if (
        (targetUserData.workExperience === '0' && currentUserData.workExperience === '1-3') ||
        (targetUserData.workExperience === '1-3' && currentUserData.workExperience === '0') ||
        (targetUserData.workExperience === '1-3' && currentUserData.workExperience === '4-5') ||
        (targetUserData.workExperience === '4-5' && currentUserData.workExperience === '1-3') ||
        (targetUserData.workExperience === '4-5' && currentUserData.workExperience === '>5') ||
        (targetUserData.workExperience === '>5' && currentUserData.workExperience === '4-5')
      ) {
        score += 10
      }
    }
    
    // 练习内容匹配
    if (targetUserData.practiceAreas && currentUserData.practiceAreas && 
        Array.isArray(targetUserData.practiceAreas) && targetUserData.practiceAreas.length > 0 &&
        Array.isArray(currentUserData.practiceAreas) && currentUserData.practiceAreas.length > 0) {
      const commonAreas = targetUserData.practiceAreas.filter((area: string) => 
        currentUserData.practiceAreas.includes(area)
      )
      
      // 每个共同练习内容增加10分，最多50分
      score += Math.min(commonAreas.length * 10, 50)
    }
    
    // 确保分数在0-100之间
    const matchScore = Math.min(Math.max(score, 0), 100)
    
    // 创建匹配请求
    await sql`
      INSERT INTO matches (
        user_id_1, 
        user_id_2, 
        match_score, 
        status
      )
      VALUES (
        ${decoded.id}, 
        ${targetUserId}, 
        ${matchScore}, 
        'pending'
      )
    `
    
    return NextResponse.json(
      { message: '匹配请求已发送' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Matching request error:', error)
    return NextResponse.json(
      { error: '发送匹配请求失败' },
      { status: 500 }
    )
  }
} 