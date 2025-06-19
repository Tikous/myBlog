import { PrismaClient } from '@prisma/client'

// 写入数据库连接（主实例）
const writeClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_WRITE_URL || process.env.DATABASE_URL
    }
  }
})

// 读取数据库连接（读取副本）
const readClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_READ_URL || process.env.DATABASE_URL
    }
  }
})

// 全局实例管理
const globalForPrisma = globalThis as unknown as {
  writeClient: PrismaClient | undefined
  readClient: PrismaClient | undefined
}

export const prismaWrite = globalForPrisma.writeClient ?? writeClient
export const prismaRead = globalForPrisma.readClient ?? readClient

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.writeClient = prismaWrite
  globalForPrisma.readClient = prismaRead
}

// 便捷方法：根据操作类型自动选择连接
export function getPrismaClient(operation: 'read' | 'write' = 'read') {
  return operation === 'write' ? prismaWrite : prismaRead
}

// 默认导出（向后兼容）
export const prisma = prismaWrite 