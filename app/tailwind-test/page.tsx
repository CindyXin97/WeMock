export default function TailwindTestPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Tailwind CSS 测试页面</h1>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">按钮样式</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            主要按钮
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            次要按钮
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            成功按钮
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            危险按钮
          </button>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
            轮廓按钮
          </button>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">卡片组件</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">卡片标题 1</h3>
            <p className="text-gray-600">这是一个使用 Tailwind CSS 构建的简单卡片示例。</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">卡片标题 2</h3>
            <p className="text-gray-600">这是一个使用 Tailwind CSS 构建的简单卡片示例。</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">卡片标题 3</h3>
            <p className="text-gray-600">这是一个使用 Tailwind CSS 构建的简单卡片示例。</p>
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">表单元素</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              输入框
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入文本"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              下拉选择
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>选项一</option>
              <option>选项二</option>
              <option>选项三</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              复选框
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">我同意条款和条件</span>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">提示和警告</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  这是一条信息提示。它提供了一些附加上下文。
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  这是一条警告提示。有一些需要注意的事项。
                </p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  这是一条错误提示。发生了一些问题需要立即解决。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 