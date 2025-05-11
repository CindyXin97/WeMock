import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 初始化数据库连接
const DATABASE_URL = process.env.DATABASE_URL || '';

export async function GET() {
  try {
    // 创建一次性连接
    const pool = new Pool({
      connectionString: DATABASE_URL,
    });

    // 检查nickname列是否存在
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'nickname'
    `);

    if (checkResult.rows.length === 0) {
      // 添加nickname列
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN nickname TEXT
      `);
      await pool.end();
      return NextResponse.json({ success: true, message: 'nickname字段已添加' });
    } else {
      await pool.end();
      return NextResponse.json({ success: true, message: 'nickname字段已存在' });
    }
  } catch (error) {
    console.error('添加字段失败:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 