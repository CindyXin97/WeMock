import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <h1 className="text-4xl font-bold">WeMock</h1>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "通过 WeMock，我找到了志同道合的面试练习伙伴，让我的面试准备更加高效。"
            </p>
            <footer className="text-sm">John Doe</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              登录
            </h1>
            <p className="text-sm text-muted-foreground">
              输入您的邮箱和密码登录
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
} 