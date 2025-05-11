import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 模拟通知数据
const mockNotifications = [
  {
    id: 1,
    title: '新的匹配请求',
    message: '张三想和你进行SQL面试练习',
    time: '10分钟前',
    read: false
  },
  {
    id: 2,
    title: '面试提醒',
    message: '与李四的面试将在30分钟后开始',
    time: '1小时前',
    read: false
  },
  {
    id: 3,
    title: '面试反馈',
    message: '王五对你的面试表现进行了评价',
    time: '2小时前',
    read: true
  }
]

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = mockNotifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">通知</h3>
            </div>
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="ml-2 h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
            ))}
            <div className="px-4 py-2 border-t border-gray-100">
              <Button variant="ghost" className="w-full text-sm">
                查看全部通知
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 