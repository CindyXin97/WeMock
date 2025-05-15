import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// 定义匹配用户的类型
type MatchUser = {
  id: number;
  username: string;
  nickname: string | null;
  targetRole: string | null;
  workExperience: string | null;
  practiceAreas: string[];
  targetIndustry: string | null;
  targetCompany: string | null;
}

export async function MatchingList() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/login")
  }

  try {
    // 获取所有用户，以简化演示
    const matches = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        targetRole: true,
        workExperience: true,
        practiceAreas: true,
        targetIndustry: true,
        targetCompany: true,
      },
    })

    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {matches.length === 0 ? (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              暂无匹配用户
            </li>
          ) : (
            matches.map((match: MatchUser) => (
              <li key={match.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {match.nickname || match.username || '未命名用户'}
                      </p>
                      <p className="ml-2 flex-shrink-0 inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {match.targetRole || '无目标角色'}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Link href={`/interview/schedule?interviewerId=${match.id}`}>
                        <Button>预约面试</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        工作年限：{match.workExperience || '未知'}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        目标行业：{match.targetIndustry || '未设置'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      练习方向：
                      {match.practiceAreas?.length > 0 
                        ? match.practiceAreas.join(", ") 
                        : '未设置'}
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    )
  } catch (error) {
    console.error("获取匹配列表错误:", error)
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-500">获取匹配用户列表失败，请稍后重试</p>
      </div>
    )
  }
} 