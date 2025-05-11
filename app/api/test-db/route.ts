import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // 测试数据库连接
    const timestamp = await sql`SELECT current_timestamp`
    
    // 获取用户数量
    const users = await sql`SELECT COUNT(*) as count FROM users`
    
    return NextResponse.json({
      status: 'connected',
      timestamp: timestamp[0].current_timestamp,
      userCount: users[0].count
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown database error' 
      },
      { status: 500 }
    )
  }
} 