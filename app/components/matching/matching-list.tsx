import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const prisma = new PrismaClient()

export async function MatchingList() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/login")
  }

  // 获取所有潜在匹配用户，不进行筛选
  const matches = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
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
        {matches.map((match) => (
          <li key={match.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {match.name}
                  </p>
                  <p className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {match.targetRole}
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
                    工作年限：{match.workExperience}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    目标行业：{match.targetIndustry}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  练习方向：{match.practiceAreas.join(", ")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 