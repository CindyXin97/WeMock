import { ScheduleForm } from "@/components/interview/schedule-form"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            预约面试
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            请选择面试类型和时间
          </p>
        </div>

        <form className="space-y-8 bg-white shadow rounded-lg p-6">
          {/* 面试官信息 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">面试官信息</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">张明</h3>
                  <p className="text-sm text-gray-500">资深数据分析师 @ 腾讯</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  5年经验
                </span>
              </div>
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {["Python", "SQL", "数据可视化"].map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 面试类型 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">面试类型</h2>
            <div className="space-y-4">
              {[
                { id: "technical", name: "技术面试", description: "SQL、Python等技术问题" },
                { id: "case", name: "案例分析", description: "实际业务场景分析" },
                { id: "behavior", name: "行为面试", description: "过往经历、软技能等" },
              ].map((type) => (
                <div key={type.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={type.id}
                      name="interview-type"
                      type="radio"
                      value={type.id}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={type.id} className="font-medium text-gray-700">
                      {type.name}
                    </label>
                    <p className="text-gray-500">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 面试时间 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">面试时间</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {["上午 10:00", "下午 14:00", "下午 16:00", "晚上 19:00", "晚上 20:00"].map((time) => (
                <div key={time} className="flex items-center">
                  <input
                    type="radio"
                    id={time}
                    name="interview-time"
                    value={time}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={time} className="ml-2 block text-sm text-gray-900">
                    {time}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 备注信息 */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              备注信息（选填）
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="有什么特殊要求或需要说明的事项？"
            />
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                确认预约
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 