export function MatchingList() {
  const mockData = [
    {
      id: 1,
      name: "张明",
      title: "资深数据分析师",
      company: "腾讯",
      experience: "5年",
      skills: ["Python", "SQL", "数据可视化"],
      availability: "工作日晚上",
    },
    {
      id: 2,
      name: "李华",
      title: "数据科学家",
      company: "阿里巴巴",
      experience: "3年",
      skills: ["机器学习", "Python", "R"],
      availability: "周末",
    },
  ]

  return (
    <div className="space-y-4">
      {mockData.map((profile) => (
        <div
          key={profile.id}
          className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-500">{profile.title} @ {profile.company}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {profile.experience}经验
            </span>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              可面试时间：{profile.availability}
            </span>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              预约面试
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 