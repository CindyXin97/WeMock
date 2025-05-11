import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-5xl font-bold text-center mb-4 tracking-tight">MockPal</h1>
        <p className="text-lg md:text-2xl text-center mb-14 text-gray-700 font-medium">专为数据岗位(DA/DS/DE)求职者设计的模拟面试匹配平台</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-16">
          <Card className="flex flex-col items-center py-8 px-4 border-2 border-gray-200 shadow-xl rounded-2xl bg-white">
            <CardHeader className="flex flex-col items-center mb-2">
              <span className="text-6xl mb-3">👤</span>
              <span className="text-xl font-bold">填写标签</span>
            </CardHeader>
            <CardContent className="text-center text-gray-500 text-base font-normal px-2">
              岗位类型、经验水平、目标公司/行业等标签快速描述你的需求
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center py-8 px-4 border-2 border-gray-200 shadow-xl rounded-2xl bg-white">
            <CardHeader className="flex flex-col items-center mb-2">
              <span className="text-6xl mb-3">🔍</span>
              <span className="text-xl font-bold">匹配伙伴</span>
            </CardHeader>
            <CardContent className="text-center text-gray-500 text-base font-normal px-2">
              基于标签匹配最适合的练习伙伴，浏览候选人并选择喜欢的对象
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center py-8 px-4 border-2 border-gray-200 shadow-xl rounded-2xl bg-white">
            <CardHeader className="flex flex-col items-center mb-2">
              <span className="text-6xl mb-3">🤝</span>
              <span className="text-xl font-bold">开始练习</span>
            </CardHeader>
            <CardContent className="text-center text-gray-500 text-base font-normal px-2">
              匹配成功后可查看联系方式，立即开始面试练习
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-2">
          <Link href="/login">
            <Button size="lg" className="px-10 text-base">登录</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="px-10 text-base">注册</Button>
          </Link>
          <Link href="/test-db">
            <Button size="lg" variant="ghost" className="px-10 text-base">测试数据库</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
