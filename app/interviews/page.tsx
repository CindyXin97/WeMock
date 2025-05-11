import { Button } from '@/components/ui/button'

// 模拟数据
const mockInterviews = [
  {
    id: 1,
    partner: '李四',
    role: '数据科学家',
    date: '2024-03-20 14:00',
    duration: '60分钟',
    type: 'SQL面试',
    status: '已完成',
    feedback: '表现优秀，SQL基础扎实'
  },
  {
    id: 2,
    partner: '王五',
    role: '数据工程师',
    date: '2024-03-22 15:30',
    duration: '45分钟',
    type: 'Python算法',
    status: '待开始',
    feedback: null
  },
  {
    id: 3,
    partner: '张三',
    role: '数据分析师',
    date: '2024-03-18 10:00',
    duration: '60分钟',
    type: 'Case Study',
    status: '已完成',
    feedback: '案例分析思路清晰，但需要加强数据可视化部分'
  }
]

export default function InterviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">面试记录</h1>
          <p className="mt-2 text-gray-600">查看你的面试历史和反馈</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    面试伙伴
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    面试类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    反馈
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockInterviews.map((interview) => (
                  <tr key={interview.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {interview.partner}
                        </div>
                        <div className="ml-2 text-sm text-gray-500">
                          {interview.role}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{interview.type}</div>
                      <div className="text-sm text-gray-500">{interview.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {interview.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        interview.status === '已完成' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {interview.feedback || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {interview.status === '待开始' ? (
                        <Button variant="outline" size="sm">
                          开始面试
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          查看详情
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 