import { NextRequest, NextResponse } from 'next/server'
import { prismaRead, prismaWrite } from '@/lib/prisma-cluster'

export async function GET() {
  try {
    const posts = await prismaRead.post.findMany({
      include: {
        author: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    
    // 禁用缓存，确保获取最新数据
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('获取博客列表失败:', error)
    return NextResponse.json(
      { error: '获取博客列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, summary, tags, published } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      )
    }

    // 创建或获取标签
    const tagRecords = []
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = await prismaWrite.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        })
        tagRecords.push({ id: tag.id })
      }
    }

    // 创建博客文章
    const post = await prismaWrite.post.create({
      data: {
        title,
        content,
        summary: summary || null,
        published: published || false,
        tags: {
          connect: tagRecords,
        },
      },
      include: {
        author: true,
        tags: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('创建博客失败:', error)
    return NextResponse.json(
      { error: '创建博客失败' },
      { status: 500 }
    )
  }
} 