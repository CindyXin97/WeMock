import { Button } from '@/components/ui/button'

// 模拟数据
const mockPartners = [
  {
    id: 1,
    name: '张三',
    role: '数据分析师',
    experience: '3年',
    target: '互联网',
    tags: ['SQL', 'Python', 'Tableau'],
    avatar: '👨‍💻'
  },
  {
    id: 2,
    name: '李四',
    role: '数据科学家',
    experience: '5年',
    target: '金融',
    tags: ['机器学习', 'Python', 'R'],
    avatar: '👩‍💻'
  },
  {
    id: 3,
    name: '王五',
    role: '数据工程师',
    experience: '4年',
    target: '电商',
    tags: ['Spark', 'Hadoop', 'SQL'],
    avatar: '👨‍💻'
  }
]

export default function MatchingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">寻找练习伙伴</h1>
          <p className="mt-2 text-gray-600">基于你的标签，我们为你推荐了以下练习伙伴</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPartners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{partner.avatar}</div>
                <div>
                  <h3 className="text-lg font-semibold">{partner.name}</h3>
                  <p className="text-gray-600">{partner.role} · {partner.experience}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">目标行业：{partner.target}</p>
                <div className="flex flex-wrap gap-2">
                  {partner.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                发起匹配
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 