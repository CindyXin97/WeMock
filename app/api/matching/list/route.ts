import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 计算匹配度
function calculateMatchScore(user1: any, user2: any): number {
  let score = 0
  const maxScore = 100

  // 目标岗位匹配 (30分)
  if (user1.targetRole === user2.targetRole) {
    score += 30
  }

  // 工作年限匹配 (20分)
  if (user1.workExperience === user2.workExperience) {
    score += 20
  }

  // 练习内容匹配 (30分)
  const commonAreas = user1.practiceAreas.filter((area: string) =>
    user2.practiceAreas.includes(area)
  )
  score += (commonAreas.length / Math.max(user1.practiceAreas.length, user2.practiceAreas.length)) * 30

  // 目标行业匹配 (10分)
  if (user1.targetIndustry && user2.targetIndustry && user1.targetIndustry === user2.targetIndustry) {
    score += 10
  }

  // 目标公司匹配 (10分)
  if (user1.targetCompany && user2.targetCompany && user1.targetCompany === user2.targetCompany) {
    score += 10
  }

  return Math.round(score)
}

export async function GET(request: Request) {
  try {
    // 这里应该从session或token中获取当前用户ID
    // 暂时使用硬编码的测试用户ID
    const currentUserId = 1 // 使用整数ID

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
    const usersWithScores = otherUsers.map(user => ({
      ...user,
      displayName: user.nickname || user.username, // 使用nickname或username作为显示名称
      matchScore: calculateMatchScore(currentUser, user),
    }))

    // 按匹配度降序排序
    usersWithScores.sort((a, b) => b.matchScore - a.matchScore)

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