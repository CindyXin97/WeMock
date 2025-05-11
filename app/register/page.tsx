import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register | WeMock',
  description: 'Create your WeMock account',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">创建账号</h1>
          <p className="mt-2 text-sm text-gray-600">
            填写以下信息，开始您的模拟面试之旅
          </p>
        </div>
        
        <div className="mt-8 bg-white p-8 shadow rounded-lg">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
} 