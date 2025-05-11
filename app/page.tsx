export default function Home() {
  return (
    <div className="p-8 mx-auto max-w-3xl">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">WeMock</h1>
      <p className="text-lg text-gray-600 mb-6">
        专为数据岗位 DA, DS, DE 求职者设计的模拟面试匹配平台
      </p>
      <div className="flex gap-4">
        <a 
          href="/login" 
          className="px-5 py-2.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
        >
          立即登录
        </a>
        <a 
          href="/register" 
          className="px-5 py-2.5 bg-white text-blue-600 border border-blue-600 rounded font-medium hover:bg-blue-50"
        >
          注册账号
        </a>
      </div>
    </div>
  )
}
