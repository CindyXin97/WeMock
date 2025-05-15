import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

// 标记为动态路由，防止静态生成导致的headers错误
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  userId: z.number(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = requestSchema.parse(body)

    // 这里应该从session或token中获取当前用户ID
    // 暂时使用硬编码的测试用户ID
    const currentUserId = 1

    // 创建面试请求
    const interview = await prisma.interview.create({
      data: {
        interview_type: "模拟面试",
        status: "pending",
        scheduled_time: new Date(),
        interviewerId: currentUserId,
        intervieweeId: userId,
      },
    })

    return NextResponse.json({
      message: "面试请求已发送",
      interview,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "输入数据验证失败", details: error.errors },
        { status: 400 }
      )
    }

    console.error("创建面试请求错误:", error)
    return NextResponse.json(
      { error: "创建面试请求失败" },
      { status: 500 }
    )
  }
} 