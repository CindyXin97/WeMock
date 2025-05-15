import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { query } from '@/lib/database'

// 定义用户类型
interface User {
  id: number;
  username: string;
  nickname: string | null;
  targetRole: string | null;
  workExperience: string | null;
  practiceAreas: string[];
  targetIndustry: string | null;
  targetCompany: string | null;
  availableTimes?: string[];
}

// 带匹配分数的用户类型
interface UserWithScore extends User {
  matchScore: number;
}

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
    
    // 获取当前用户信息
    const currentUser = await query<User>(
      `SELECT 
        id, 
        target_role as "targetRole", 
        work_experience as "workExperience", 
        practice_areas as "practiceAreas"
      FROM users 
      WHERE id = $1`,
      [decoded.userId]
    )
    
    if (currentUser.length === 0) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }
    
    // 获取所有可匹配的用户（排除自己）
    const users = await query<User>(
      `SELECT 
        id, 
        username, 
        nickname,
        target_role as "targetRole", 
        work_experience as "workExperience", 
        practice_areas as "practiceAreas",
        target_industry as "targetIndustry", 
        target_company as "targetCompany",
        available_times as "availableTimes"
      FROM users 
      WHERE id <> $1`,
      [decoded.userId]
    )
    
    // 计算匹配度
    const usersWithScore = users.map((user: User): UserWithScore => {
      // 简单的匹配算法
      let score = 0
      const currentUserData = currentUser[0]
      
      // 目标岗位匹配 - 只有当双方都有设置目标岗位时才计算
      if (user.targetRole && currentUserData.targetRole && user.targetRole === currentUserData.targetRole) {
        score += 30
      }
      
      // 工作经验匹配（相近经验） - 只有当双方都有设置工作经验时才计算
      if (user.workExperience && currentUserData.workExperience) {
        if (user.workExperience === currentUserData.workExperience) {
          score += 20
        } else if (
          (user.workExperience === '0' && currentUserData.workExperience === '1-3') ||
          (user.workExperience === '1-3' && currentUserData.workExperience === '0') ||
          (user.workExperience === '1-3' && currentUserData.workExperience === '4-5') ||
          (user.workExperience === '4-5' && currentUserData.workExperience === '1-3') ||
          (user.workExperience === '4-5' && currentUserData.workExperience === '>5') ||
          (user.workExperience === '>5' && currentUserData.workExperience === '4-5')
        ) {
          score += 10
        }
      }
      
      // 练习内容匹配 - 只有当双方都有设置练习内容时才计算
      if (user.practiceAreas && currentUserData.practiceAreas && 
          Array.isArray(user.practiceAreas) && user.practiceAreas.length > 0 && 
          Array.isArray(currentUserData.practiceAreas) && currentUserData.practiceAreas.length > 0) {
        
        const commonAreas = user.practiceAreas.filter((area: string) => 
          currentUserData.practiceAreas.includes(area)
        )
        
        // 每个共同练习内容增加10分，最多50分
        score += Math.min(commonAreas.length * 10, 50)
      }
      
      // 如果用户没有设置任何匹配信息，给一个基础分数
      if (!currentUserData.targetRole && !currentUserData.workExperience && 
          (!currentUserData.practiceAreas || currentUserData.practiceAreas.length === 0)) {
        score = 60; // 默认匹配度
      }
      
      // 确保分数在0-100之间
      return {
        ...user,
        matchScore: Math.min(Math.max(score, 50), 100) // 最低保证50分的匹配度
      }
    })
    
    // 按匹配度降序排序
    usersWithScore.sort((a: UserWithScore, b: UserWithScore) => b.matchScore - a.matchScore)
    
    return NextResponse.json({
      users: usersWithScore
    })
  } catch (error) {
    console.error('Matching list error:', error)
    return NextResponse.json(
      { error: '获取匹配列表失败' },
      { status: 500 }
    )
  }
} 