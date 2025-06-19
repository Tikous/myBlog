import { PrismaClient } from '@prisma/client'

// 修复数据库连接不稳定的配置
const createPrismaClient = (url: string) => {
  return new PrismaClient({
    datasources: {
      db: { url }
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// 写入数据库连接（主实例）
const writeClient = createPrismaClient(
  process.env.DATABASE_WRITE_URL || process.env.DATABASE_URL || ''
)

// 对于读写分离延迟问题，暂时使用同一个连接
// 这样可以确保读写一致性
const readClient = createPrismaClient(
  process.env.DATABASE_WRITE_URL || process.env.DATABASE_URL || ''
)

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

// 优雅关闭数据库连接
process.on('beforeExit', async () => {
  await prismaWrite.$disconnect()
  await prismaRead.$disconnect()
}) 