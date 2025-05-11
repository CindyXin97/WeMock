import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { intervieweeId, suggestedTime } = await req.json()

    if (!intervieweeId) {
      return NextResponse.json(
        { error: '请选择面试对象' },
        { status: 400 }
      )
    }

    // 创建面试请求
    const interview = await prisma.interview.create({
      data: {
        intervieweeId,
        status: 'PENDING',
        suggestedTime: suggestedTime || null,
      },
    })

    return NextResponse.json(
      { message: '面试请求已发送', interview },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating interview:', error)
    return NextResponse.json(
      { error: '创建面试请求失败，请稍后重试' },
      { status: 500 }
    )
  }
} 