import { prismaRead } from '@/lib/prisma-cluster'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'

async function getPost(id: string) {
  try {
    const post = await prismaRead.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true,
        tags: true,
      },
    })
    return post
  } catch (error) {
    console.error('获取博客详情失败:', error)
    return null
  }
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 返回按钮 */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft size={20} />
        返回博客列表
      </Link>

      {/* 博客头部信息 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>
              {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
            </span>
          </div>
          
          {post.author && (
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author.name || post.author.email}</span>
            </div>
          )}
        </div>

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <Tag size={16} className="text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: { id: number; name: string }) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 摘要 */}
        {post.summary && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">{post.summary}</p>
          </div>
        )}
      </header>

      {/* 博客内容 */}
      <article className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <SyntaxHighlighter
                  style={tomorrow as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>

      {/* 底部信息 */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-gray-500 text-sm">
          最后更新于 {format(new Date(post.updatedAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
        </div>
      </footer>
    </div>
  )
} 