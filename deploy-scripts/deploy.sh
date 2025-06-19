#!/bin/bash

echo "🚀 开始部署博客项目到腾讯云轻量服务器"
echo "======================================="

# 项目配置
PROJECT_DIR="/var/www/myblog"
REPO_URL="https://github.com/你的用户名/myBlog.git"  # 替换为你的仓库地址
BRANCH="main"

# 检查是否为首次部署
if [ ! -d "$PROJECT_DIR/.git" ]; then
    echo "📥 首次部署，克隆项目..."
    cd /var/www
    
    # 克隆项目
    git clone $REPO_URL temp_myblog
    
    # 如果克隆的项目在子目录中，移动到正确位置
    if [ -d "temp_myblog/myBlog" ]; then
        mv temp_myblog/myBlog myblog
        rm -rf temp_myblog
    else
        mv temp_myblog myblog
    fi
    
    cd $PROJECT_DIR
else
    echo "🔄 更新项目代码..."
    cd $PROJECT_DIR
    git fetch origin
    git reset --hard origin/$BRANCH
fi

# 检查环境变量文件
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "⚠️  警告：未找到.env文件！"
    echo "请创建.env文件并配置以下变量："
    echo ""
    cat << EOF
# 数据库连接
DATABASE_URL="postgresql://postgres:password@your-aurora-endpoint:5432/blog_db?schema=public"
DATABASE_WRITE_URL="postgresql://postgres:password@write-endpoint:5432/blog_db?schema=public"
DATABASE_READ_URL="postgresql://postgres:password@read-endpoint:5432/blog_db?schema=public"

# Next.js配置
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# 生产环境
NODE_ENV="production"
EOF
    echo ""
    echo "请手动创建.env文件后重新运行此脚本"
    exit 1
fi

# 清理旧文件
echo "🧹 清理旧的构建文件..."
rm -rf .next
rm -rf node_modules

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 生成Prisma客户端
echo "🔧 生成Prisma客户端..."
npm run db:generate

# 构建项目
echo "🏗️  构建项目..."
npm run build

# 验证构建
if [ ! -f ".next/BUILD_ID" ]; then
    echo "❌ 构建失败：找不到BUILD_ID文件"
    exit 1
fi

echo "✅ 构建验证成功"

# 停止旧的PM2进程
echo "🛑 停止旧进程..."
pm2 stop myblog 2>/dev/null || true
pm2 delete myblog 2>/dev/null || true

# 启动新进程
echo "🚀 启动新进程..."
pm2 start npm --name "myblog" -- start

# 保存PM2配置
pm2 save
pm2 startup

echo "✅ 部署完成！"
echo ""
echo "📊 应用状态："
pm2 status

echo ""
echo "🌐 访问地址："
echo "- 本地：http://localhost:3000"
echo "- 公网：http://你的服务器IP:3000"
echo ""
echo "💡 下一步："
echo "1. 配置Nginx反向代理"
echo "2. 配置SSL证书"
echo "3. 绑定域名" 