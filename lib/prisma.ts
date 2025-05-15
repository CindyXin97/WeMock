// 避免在Vercel环境中使用直接导入
// 通过require动态加载PrismaClient
// 这种方式在Vercel环境中更可靠

import { PrismaClient } from '@prisma/client'

// 声明全局变量类型
declare global {
  var prisma: PrismaClient | undefined;
}

// 避免热重载时创建多个Prisma实例
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export { prisma };
export default prisma; 