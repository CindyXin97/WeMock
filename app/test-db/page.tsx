import { neon } from '@neondatabase/serverless'

export default async function TestDB() {
  const sql = neon(process.env.DATABASE_URL!)
  
  // 测试数据库连接
  const result = await sql`
    SELECT current_timestamp
  `
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">数据库连接测试</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p>数据库连接时间：{result[0].current_timestamp.toString()}</p>
      </div>
    </div>
  )
} 