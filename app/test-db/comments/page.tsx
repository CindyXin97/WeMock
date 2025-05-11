import { neon } from '@neondatabase/serverless'

export default async function CommentsPage() {
  const sql = neon(process.env.DATABASE_URL!)
  
  // 获取所有评论
  const comments = await sql`
    SELECT * FROM comments ORDER BY created_at DESC
  `
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">评论测试</h1>
      
      <form action={async (formData: FormData) => {
        'use server'
        const sql = neon(process.env.DATABASE_URL!)
        const comment = formData.get('comment')
        await sql`
          INSERT INTO comments (comment) 
          VALUES (${comment})
        `
      }}>
        <div className="mb-4">
          <input
            type="text"
            name="comment"
            placeholder="写一条评论..."
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          提交
        </button>
      </form>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">所有评论</h2>
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <div key={comment.id} className="bg-gray-100 p-4 rounded">
              <p>{comment.comment}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 