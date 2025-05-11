import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              MockPal
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/matching">
              <Button variant="ghost">寻找伙伴</Button>
            </Link>
            <Link href="/interviews">
              <Button variant="ghost">面试记录</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">个人中心</Button>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">登录</Button>
            </Link>
            <Link href="/register">
              <Button>注册</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 