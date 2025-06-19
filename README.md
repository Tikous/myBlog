# 个人博客系统 📝

一个基于 Next.js 14、Prisma 和 Aurora PostgreSQL 构建的现代化个人博客系统，支持读写分离架构。

![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Aurora-336791?style=for-the-badge&logo=postgresql)

## ✨ 功能特性

- 📝 **Markdown编辑器**: 支持实时预览的Markdown写作体验
- 🎨 **现代化UI**: 使用Tailwind CSS构建的响应式界面
- 🏷️ **标签系统**: 灵活的博客分类和标签管理
- 🔍 **代码高亮**: 支持多种编程语言的语法高亮显示
- 📊 **读写分离**: Aurora PostgreSQL集群的高性能数据库架构
- 📱 **响应式设计**: 完美适配桌面端、平板和移动设备
- ⚡ **性能优化**: Next.js 14 App Router + 服务端渲染
- 🔒 **类型安全**: 完整的TypeScript支持

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS + @tailwindcss/typography
- **数据库**: AWS Aurora PostgreSQL (读写分离)
- **ORM**: Prisma
- **UI组件**: Lucide React Icons
- **Markdown**: React Markdown + React Syntax Highlighter
- **部署**: Vercel (推荐)

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn
- AWS Aurora PostgreSQL 数据库

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/Tikous/myBlog.git
   cd myBlog
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env` 文件：
   ```env
   # Aurora PostgreSQL 读写分离配置
   DATABASE_URL="postgresql://postgres:password@cluster-endpoint:5432/blog_db?schema=public"
   DATABASE_WRITE_URL="postgresql://postgres:password@write-endpoint:5432/blog_db?schema=public"
   DATABASE_READ_URL="postgresql://postgres:password@read-endpoint:5432/blog_db?schema=public"
   
   # Next.js 配置
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **初始化数据库**
   ```bash
   npm run db:push
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
myBlog/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   │   └── posts/         # 博客文章 API
│   ├── blog/              # 博客详情页
│   │   └── [id]/          # 动态路由
│   ├── write/             # 写博客页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── BlogCard.tsx       # 博客卡片组件
│   └── Navbar.tsx         # 导航栏组件
├── lib/                   # 工具库
│   ├── prisma.ts          # Prisma 客户端
│   └── prisma-cluster.ts  # 读写分离配置
├── prisma/                # 数据库相关
│   └── schema.prisma      # 数据库模式
└── package.json           # 项目依赖
```

## 🗄️ 数据库设计

### Post (博客文章)
- `id`: 主键
- `title`: 标题
- `content`: 内容 (Markdown)
- `summary`: 摘要
- `published`: 是否发布
- `createdAt`: 创建时间
- `updatedAt`: 更新时间
- `authorId`: 作者ID (外键)
- `tags`: 标签 (多对多关系)

### User (用户)
- `id`: 主键
- `email`: 邮箱
- `name`: 姓名
- `posts`: 博客文章 (一对多关系)

### Tag (标签)
- `id`: 主键
- `name`: 标签名
- `posts`: 博客文章 (多对多关系)

## 📖 使用指南

### 写博客

1. 点击导航栏的"写博客"按钮
2. 填写博客标题、摘要和标签
3. 在内容区域使用 Markdown 语法写作
4. 使用右侧预览区域查看效果
5. 选择"立即发布"或保存为草稿
6. 点击"发布博客"完成发布

### Markdown 语法支持

- **标题**: `# ## ###`
- **粗体**: `**粗体文本**`
- **斜体**: `*斜体文本*`
- **代码块**: ` ```javascript `
- **链接**: `[链接文本](URL)`
- **图片**: `![图片描述](图片URL)`
- **列表**: `- 列表项`

## 🔧 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run db:generate  # 生成 Prisma 客户端
npm run db:push      # 推送数据库模式
npm run db:migrate   # 运行数据库迁移
npm run db:studio    # 打开 Prisma Studio
```

## 🚀 部署

### Vercel 部署 (推荐)

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量
4. 自动部署完成

### 环境变量配置

生产环境需要配置以下环境变量：

```env
DATABASE_URL=your-production-database-url
DATABASE_WRITE_URL=your-write-endpoint
DATABASE_READ_URL=your-read-endpoint
NEXTAUTH_URL=your-production-domain
NEXTAUTH_SECRET=your-production-secret
```

## 🏗️ 架构特点

### 读写分离架构

- **写操作** (创建、更新博客) → 主数据库实例
- **读操作** (查询博客列表、详情) → 读取副本实例
- **自动故障转移** → Aurora 集群高可用性
- **性能优化** → 读写分离减轻主实例压力

### 性能优化

- **服务端渲染** (SSR) 提升首屏加载速度
- **静态生成** (SSG) 优化SEO和性能
- **代码分割** 按需加载减少包体积
- **图片优化** Next.js 自动优化图片

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Prisma](https://www.prisma.io/) - 现代数据库工具包
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Lucide](https://lucide.dev/) - 精美的开源图标库

## 📞 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系：

- 创建 [Issue](https://github.com/Tikous/myBlog/issues)
- 发起 [Discussion](https://github.com/Tikous/myBlog/discussions)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！ 