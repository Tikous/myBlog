import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被删除。
        </p>
        <Link
          href="/"
          className="btn-primary flex items-center gap-2 mx-auto w-fit"
        >
          <Home size={20} />
          返回首页
        </Link>
      </div>
    </div>
  )
} 