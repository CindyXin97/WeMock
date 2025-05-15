import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

// 标记为动态路由，防止静态生成导致的headers错误
export const dynamic = 'force-dynamic';

// 获取当前用户ID
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
    return null
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req)
    
    if (!userId) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 获取用户的所有面试（作为面试官或被面试者）
    const interviews = await prisma.interview.findMany({
      where: {
        OR: [
          { intervieweeId: userId },
          { interviewerId: userId }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 手动获取相关用户信息
    const enhancedInterviews = await Promise.all(
      interviews.map(async (interview) => {
        const interviewer = await prisma.user.findUnique({
          where: { id: interview.interviewerId },
          select: {
            id: true,
            username: true,
            nickname: true
          }
        })
        
        const interviewee = await prisma.user.findUnique({
          where: { id: interview.intervieweeId },
          select: {
            id: true,
            username: true,
            nickname: true
          }
        })
        
        return {
          ...interview,
          interviewer,
          interviewee
        }
      })
    )

    return NextResponse.json({ interviews: enhancedInterviews })
  } catch (error) {
    console.error('Error fetching interviews:', error)
    return NextResponse.json(
      { error: '获取面试列表失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { intervieweeId, suggestedTime, interviewerId, type = "模拟面试" } = await req.json()

    if (!intervieweeId) {
      return NextResponse.json(
        { error: '请选择面试对象' },
        { status: 400 }
      )
    }

    if (!interviewerId) {
      return NextResponse.json(
        { error: '面试官信息缺失' },
        { status: 400 }
      )
    }

    // 创建面试请求
    const interview = await prisma.interview.create({
      data: {
        interview_type: type,
        status: 'pending',
        scheduled_time: suggestedTime || null,
        interviewerId: parseInt(interviewerId),
        intervieweeId: parseInt(intervieweeId)
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