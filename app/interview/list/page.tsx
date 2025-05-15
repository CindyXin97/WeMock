import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

// 定义面试记录的类型，匹配Prisma模型
type Interview = {
  id: number;
  match_id: number | null;
  interviewerId: number;
  intervieweeId: number;
  interview_type: string | null;
  status: string | null;
  scheduled_time: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// 定义用户类型
type User = {
  id: number;
  username: string;
  nickname: string | null;
}

// 定义空用户对象类型
type EmptyUser = {
  username?: string;
  nickname?: string | null;
}

export default async function InterviewListPage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/login")
  }

  try {
    // 获取所有面试记录
    const interviews = await prisma.interview.findMany({
      orderBy: {
        scheduled_time: "desc",
      },
    })

    // 获取所有用户以便查找面试官和候选人信息
    const userIdSet = new Set<number>()
    interviews.forEach((interview: Interview) => {
      userIdSet.add(interview.interviewerId)
      userIdSet.add(interview.intervieweeId)
    })
    const userIds = Array.from(userIdSet)
    
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      }
    })

    // 创建用户ID到用户信息的映射
    const userMap = new Map<number, User>()
    users.forEach((user: User) => {
      userMap.set(user.id, user)
    })

    // 创建默认的空用户对象
    const emptyUser: EmptyUser = {
      username: "未命名",
      nickname: null
    }

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            我的面试
          </h2>

          {interviews.length === 0 ? (
            <div className="bg-white shadow sm:rounded-md p-6 text-center text-gray-500">
              暂无面试记录
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {interviews.map((interview: Interview) => {
                  const interviewer = userMap.get(interview.interviewerId) || emptyUser
                  const interviewee = userMap.get(interview.intervieweeId) || emptyUser
                  
                  return (
                    <li key={interview.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {interview.interview_type || "未指定类型"}
                            </p>
                            <p className="ml-2 flex-shrink-0 inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {interview.status || "未知状态"}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">
                              {interview.scheduled_time 
                                ? format(new Date(interview.scheduled_time), "PPP p", {
                                    locale: zhCN,
                                  })
                                : "未安排时间"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              面试官：{interviewer.nickname || interviewer.username || "未命名"}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              候选人：{interviewee.nickname || interviewee.username || "未命名"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("获取面试列表错误:", error)
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            我的面试
          </h2>
          <div className="bg-red-50 p-6 rounded-md text-red-500">
            获取面试列表失败，请稍后重试
          </div>
        </div>
      </div>
    )
  }
} 