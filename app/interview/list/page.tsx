import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

const prisma = new PrismaClient()

export default async function InterviewListPage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/login")
  }

  // 获取所有面试记录，不进行筛选
  const interviews = await prisma.interview.findMany({
    include: {
      interviewer: {
        select: { name: true },
      },
      interviewee: {
        select: { name: true },
      },
    },
    orderBy: {
      scheduledAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          我的面试
        </h2>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {interviews.map((interview) => (
              <li key={interview.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {interview.type}
                      </p>
                      <p className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {interview.status}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="text-sm text-gray-500">
                        {format(new Date(interview.scheduledAt), "PPP p", {
                          locale: zhCN,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        面试官：{interview.interviewer.name}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        候选人：{interview.interviewee.name}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 