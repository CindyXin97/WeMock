import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">仪表板</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 寻找面试官卡片 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">寻找面试官</h2>
          <p className="text-gray-600 mb-4">
            根据您的背景和目标，找到合适的面试练习伙伴
          </p>
          <Link href="/matches">
            <Button className="w-full">开始匹配</Button>
          </Link>
        </div>

        {/* 我的面试卡片 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">我的面试</h2>
          <p className="text-gray-600 mb-4">
            查看和管理您的面试安排
          </p>
          <Link href="/interviews">
            <Button className="w-full">查看面试</Button>
          </Link>
        </div>

        {/* 个人资料卡片 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">个人资料</h2>
          <p className="text-gray-600 mb-4">
            更新您的个人信息和面试偏好
          </p>
          <Link href="/profile">
            <Button className="w-full">编辑资料</Button>
          </Link>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">最近活动</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">暂无最近活动</p>
        </div>
      </div>
    </div>
  )
} 