/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 中 App Router 已经稳定，不需要 experimental.appDir
  
  // 生产环境优化
  compress: true,
  poweredByHeader: false,
  
  // 服务器配置
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig 