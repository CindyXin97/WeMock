import { Pool } from 'pg';

// 初始化数据库连接
const DATABASE_URL = process.env.DATABASE_URL || '';
const DATABASE_URL_UNPOOLED = process.env.DATABASE_URL_UNPOOLED || DATABASE_URL;

// 创建 pg 连接池
const pool = new Pool({
  connectionString: DATABASE_URL_UNPOOLED,
  max: 10,
  idleTimeoutMillis: 30000
});

// 添加连接池错误处理
pool.on('error', (err) => {
  console.error('数据库连接池错误:', err);
});

// 执行 SQL 查询的辅助函数
export async function query<T>(text: string, params: any[] = []): Promise<T[]> {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('执行查询', { text, duration, rows: res.rowCount });
    return res.rows as T[];
  } catch (error) {
    console.error('数据库查询错误:', error);
    throw error;
  }
}

// 创建数据库表
export async function initDatabase() {
  try {
    // 获取客户端连接
    const client = await pool.connect();
    
    try {
      // 开始事务
      await client.query('BEGIN');
      
      // 创建用户表
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          nickname TEXT,
          contact_info TEXT,
          target_role TEXT,
          work_experience TEXT,
          practice_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
          target_industry TEXT,
          target_company TEXT,
          available_times JSONB DEFAULT '{}'::JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 创建匹配表
      await client.query(`
        CREATE TABLE IF NOT EXISTS matches (
          id SERIAL PRIMARY KEY,
          user_id_1 INTEGER NOT NULL REFERENCES users(id),
          user_id_2 INTEGER NOT NULL REFERENCES users(id),
          match_score FLOAT,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 创建面试表
      await client.query(`
        CREATE TABLE IF NOT EXISTS interviews (
          id SERIAL PRIMARY KEY,
          match_id INTEGER REFERENCES matches(id),
          interviewer_id INTEGER NOT NULL REFERENCES users(id),
          interviewee_id INTEGER NOT NULL REFERENCES users(id),
          interview_type TEXT,
          scheduled_time TIMESTAMP WITH TIME ZONE,
          status TEXT DEFAULT 'scheduled',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 创建评分表
      await client.query(`
        CREATE TABLE IF NOT EXISTS ratings (
          id SERIAL PRIMARY KEY,
          interview_id INTEGER NOT NULL REFERENCES interviews(id),
          rated_by_id INTEGER NOT NULL REFERENCES users(id),
          rated_user_id INTEGER NOT NULL REFERENCES users(id),
          rating INTEGER CHECK (rating BETWEEN 1 AND 5),
          feedback TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 提交事务
      await client.query('COMMIT');
      
      console.log('数据库表初始化成功');
    } catch (error) {
      // 发生错误时回滚
      await client.query('ROLLBACK');
      console.error('初始化数据库表失败:', error);
      throw error;
    } finally {
      // 释放客户端连接
      client.release();
    }
  } catch (error) {
    console.error('数据库连接错误:', error);
    throw error;
  }
}

// 在事务中执行回调
export async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
} 