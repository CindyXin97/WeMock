import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return new NextResponse('缺少必要信息', { status: 400 })
    }

    // 检查邮箱是否已存在
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return new NextResponse('该邮箱已被注册', { status: 400 })
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建用户
    const result = await sql`
      INSERT INTO users (
        name, 
        email, 
        password, 
        target_role, 
        work_experience, 
        practice_areas, 
        target_industry, 
        target_company, 
        available_time
      ) VALUES (
        ${name},
        ${email},
        ${hashedPassword},
        '',
        '',
        ARRAY[]::text[],
        '',
        '',
        '{"weekdays":[], "weekends":[]}'::jsonb
      )
      RETURNING id, name, email
    `

    const user = result[0]

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (error) {
    console.error('Error in signup API:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 