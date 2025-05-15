import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from 'jose'

// 标记为动态路由，防止静态生成导致的headers错误
export const dynamic = 'force-dynamic';

// Define user type for better type safety
type User = {
  id: number;
  username: string;
  nickname: string | null;
  targetRole: string | null;
  workExperience: string | null;
  practiceAreas: string[];
  targetIndustry: string | null;
  targetCompany: string | null;
}

// Define type for user with match score
type UserWithScore = User & {
  displayName: string;
  matchScore: number;
}

// 计算匹配度
function calculateMatchScore(user1: User, user2: User): number {
  let score = 0
  const maxScore = 100

  // 目标岗位匹配 (30分)
  if (user1.targetRole && user2.targetRole && user1.targetRole === user2.targetRole) {
    score += 30
  }

  // 工作年限匹配 (20分)
  if (user1.workExperience && user2.workExperience && user1.workExperience === user2.workExperience) {
    score += 20
  }

  // 练习内容匹配 (30分)
  if (Array.isArray(user1.practiceAreas) && user1.practiceAreas.length > 0 &&
      Array.isArray(user2.practiceAreas) && user2.practiceAreas.length > 0) {
    const commonAreas = user1.practiceAreas.filter((area: string) =>
      user2.practiceAreas.includes(area)
    )
    const maxLength = Math.max(user1.practiceAreas.length, user2.practiceAreas.length)
    if (maxLength > 0) {
      score += (commonAreas.length / maxLength) * 30
    }
  }

  // 目标行业匹配 (10分)
  if (user1.targetIndustry && user2.targetIndustry && user1.targetIndustry === user2.targetIndustry) {
    score += 10
  }

  // 目标公司匹配 (10分)
  if (user1.targetCompany && user2.targetCompany && user1.targetCompany === user2.targetCompany) {
    score += 10
  }

  // 如果没有足够的匹配信息，给一个默认分数
  if (score === 0) {
    score = 60 // 默认匹配度
  }

  return Math.round(score)
}

// 从请求中获取当前用户ID
async function getUserId(req: Request) {
  const cookies = req.headers.get('cookie')
  if (!cookies) {
    return null
  }

  const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='))
  if (!tokenCookie) {
    return null
  }

  const token = tokenCookie.split('=')[1]
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
  
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload.id as number
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    // 从token中获取当前用户ID
    const currentUserId = await getUserId(request)
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: "未登录或用户认证失败" },
        { status: 401 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      )
    }

    // 获取所有其他用户
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
      },
    })

    // 计算匹配度并排序
    const usersWithScores = otherUsers.map((user: User) => {
      // 确保显示matchScore
      const matchScore = calculateMatchScore(currentUser as User, user);
      
      return {
        ...user,
        displayName: user.nickname || user.username,
        matchScore
      };
    });

    // 按匹配度降序排序
    usersWithScores.sort((a: UserWithScore, b: UserWithScore) => b.matchScore - a.matchScore)

    return NextResponse.json({
      users: usersWithScores,
    })
  } catch (error) {
    console.error("获取匹配列表错误:", error)
    return NextResponse.json(
      { error: "获取匹配列表失败" },
      { status: 500 }
    )
  }
} 