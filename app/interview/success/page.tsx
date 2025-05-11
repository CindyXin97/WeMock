import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            预约成功！
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            面试官将很快与你联系，请保持手机畅通
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">面试详情</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">面试官</dt>
              <dd className="mt-1 text-sm text-gray-900">张明 - 资深数据分析师 @ 腾讯</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">面试类型</dt>
              <dd className="mt-1 text-sm text-gray-900">技术面试</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">面试时间</dt>
              <dd className="mt-1 text-sm text-gray-900">2024年3月20日 下午 14:00</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">面试地点</dt>
              <dd className="mt-1 text-sm text-gray-900">线上会议（链接将通过邮件发送）</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          <a
            href="/matching"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            继续寻找面试官
          </a>
          <a
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  )
} 