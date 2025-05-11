import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, targetRole, workExperience, practiceAreas, targetIndustry, targetCompany } = await req.json()

    // 验证必填字段
    if (!name || !targetRole || !workExperience) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        targetRole,
        workExperience,
        practiceAreas,
        targetIndustry,
        targetCompany,
      },
    })

    return NextResponse.json(
      { message: '注册成功', user: { id: user.id, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 