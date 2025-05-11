import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const prisma = new PrismaClient()

const requestSchema = z.object({
  userId: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = requestSchema.parse(body)

    // 这里应该从session或token中获取当前用户ID
    // 暂时使用硬编码的测试用户ID
    const currentUserId = "test-user-id"

    // 创建面试请求
    const interview = await prisma.interview.create({
      data: {
        type: "模拟面试",
        status: "pending",
        scheduledAt: new Date(), // 这里应该让用户选择时间
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