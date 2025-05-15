This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# WeMock

WeMock 是一个面试练习配对平台，帮助用户找到合适的面试伙伴进行针对性练习。

## 技术栈

- **框架**: Next.js
- **UI组件库**: shadcn/ui
- **CSS库**: Tailwind CSS
- **状态管理**: Jotai
- **数据库**: Vercel Neon (PostgreSQL)

## 快速开始

1. 克隆仓库

```bash
git clone https://github.com/yourusername/wemock.git
cd wemock
```

2. 安装依赖

```bash
npm install
# 或
pnpm install
```

3. 设置环境变量

创建 `.env.local` 文件并添加必要的环境变量：

```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
ENABLE_MOCK_API=true  # 启用模拟API
```

4. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

5. 打开 [http://localhost:3000](http://localhost:3000) 查看应用

## 模拟服务

WeMock 包含一个内置的模拟服务，可以在没有后端的情况下进行前端开发。默认情况下，模拟服务是启用的。

### 主要特性

- 提供预设的模拟数据，包括用户、面试、匹配等
- 通过中间件拦截 API 请求，无需修改前端代码
- 完全兼容真实 API 接口

### 使用方法

在 `.env.local` 文件中设置：

```
ENABLE_MOCK_API=true  # 启用模拟API
```

或者在启动项目时设置环境变量：

```bash
ENABLE_MOCK_API=true npm run dev
```

想了解更多关于模拟服务的信息，请查看 [模拟服务文档](docs/MOCK.md)。

## 项目结构

```
wemock/
├── app/              # Next.js 应用目录
│   ├── api/          # API 路由
│   ├── components/   # 页面级组件
│   └── ...           # 页面目录
├── components/       # 共享组件
├── lib/              # 工具函数和服务
│   ├── mock.ts       # 模拟数据和客户端
│   └── ...           # 其他工具库
├── prisma/           # Prisma 模型
└── ...
```

## 部署

该项目可以部署在 Vercel 上：

```bash
npm run build
npm run start
```

或者使用 Vercel CLI：

```bash
vercel
```

## 了解更多

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 特性和 API
- [Tailwind CSS 文档](https://tailwindcss.com/docs) - 学习 Tailwind CSS
- [Shadcn UI 文档](https://ui.shadcn.com) - 了解 Shadcn UI 组件
- [Jotai 文档](https://jotai.org) - 学习 Jotai 状态管理
- [Vercel Neon 文档](https://neon.tech/docs) - 了解 Neon PostgreSQL
