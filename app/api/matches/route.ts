import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        targetRole: true,
        workExperience: true,
        practiceAreas: true,
        targetIndustry: true,
        targetCompany: true,
      },
    })

    // Add a displayName property for frontend convenience
    const usersWithDisplayName = users.map((user: {
      id: number;
      username: string;
      nickname: string | null;
      targetRole: string | null;
      workExperience: string | null;
      practiceAreas: string[];
      targetIndustry: string | null;
      targetCompany: string | null;
    }) => ({
      ...user,
      displayName: user.nickname || user.username
    }))

    return NextResponse.json(usersWithDisplayName)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: '获取匹配列表失败，请稍后重试' },
      { status: 500 }
    )
  }
} 