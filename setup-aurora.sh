#!/bin/bash

echo "🚀 Aurora PostgreSQL 读写分离配置向导"
echo "======================================"

echo ""
echo "请提供以下信息："

# 获取用户输入
read -p "数据库密码: " -s DB_PASSWORD
echo ""
read -p "集群写入终端节点 (例: database-1.cluster-xxxxx.ap-southeast-2.rds.amazonaws.com): " WRITE_ENDPOINT
read -p "集群读取终端节点 (例: database-1.cluster-ro-xxxxx.ap-southeast-2.rds.amazonaws.com): " READ_ENDPOINT
read -p "数据库名称 [blog_db]: " DB_NAME
DB_NAME=${DB_NAME:-blog_db}

# 创建 .env 文件
cat > .env << EOL
# Aurora PostgreSQL 读写分离配置
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@${WRITE_ENDPOINT}:5432/${DB_NAME}?schema=public"
DATABASE_WRITE_URL="postgresql://postgres:${DB_PASSWORD}@${WRITE_ENDPOINT}:5432/${DB_NAME}?schema=public"
DATABASE_READ_URL="postgresql://postgres:${DB_PASSWORD}@${READ_ENDPOINT}:5432/${DB_NAME}?schema=public"

# Next.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
EOL

echo ""
echo "✅ .env 文件已创建！"
echo ""
echo "接下来运行："
echo "npm run db:push    # 推送数据库模式"
echo "npm run dev        # 启动开发服务器" 