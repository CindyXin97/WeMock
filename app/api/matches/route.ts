import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        targetRole: true,
        workExperience: true,
        practiceAreas: true,
        targetIndustry: true,
        targetCompany: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: '获取匹配列表失败，请稍后重试' },
      { status: 500 }
    )
  }
} 