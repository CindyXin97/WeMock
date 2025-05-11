import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { query, withTransaction } from '@/lib/database'

export async function POST(req: Request) {
  try {
    const { 
      username, 
      password, 
      nickname 
    } = await req.json()

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json(
        { error: '请填写用户名和密码' },
        { status: 400 }
      )
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为6个字符' },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    const existingUsers = await query<{ id: number }>(
      'SELECT id FROM users WHERE username = $1',
      [username]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: '用户名已被占用' },
        { status: 400 }
      )
    }

    // 对密码进行加密
    const hashedPassword = await hash(password, 10)

    // 创建用户 - 使用事务确保数据完整性
    const result = await withTransaction(async (client) => {
      const insertResult = await client.query(
        `INSERT INTO users (
          username, 
          password, 
          nickname
        )
        VALUES ($1, $2, $3)
        RETURNING id, username`,
        [
          username, 
          hashedPassword, 
          nickname || null
        ]
      )
      
      return insertResult.rows[0]
    })

    console.log('User registered:', { username })

    return NextResponse.json(
      { 
        message: '注册成功', 
        user: { 
          id: result.id, 
          username: result.username 
        } 
      },
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