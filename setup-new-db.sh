#!/bin/bash

echo "🚀 新Aurora数据库配置向导"
echo "=========================="
echo ""
echo "请确保你已经："
echo "1. ✅ 删除了旧的database-1集群"
echo "2. ✅ 创建了新的Aurora PostgreSQL集群"
echo "3. ✅ 设置了'公有访问'为'是'"
echo "4. ✅ 配置了安全组允许你的IP访问端口5432"
echo ""

read -p "已完成上述步骤？(y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "请先完成上述步骤，然后重新运行此脚本"
    exit 1
fi

echo ""
echo "请提供新数据库的连接信息："
echo ""

# 获取数据库信息
read -p "集群写入终端节点 (例如: blog-database.cluster-xxxxx.ap-southeast-2.rds.amazonaws.com): " WRITE_ENDPOINT
read -p "集群只读终端节点 (例如: blog-database.cluster-ro-xxxxx.ap-southeast-2.rds.amazonaws.com): " READ_ENDPOINT
read -p "数据库密码: " -s DB_PASSWORD
echo ""
read -p "数据库名称 [blog_db]: " DB_NAME
DB_NAME=${DB_NAME:-blog_db}

echo ""
echo "正在创建配置文件..."

# 备份旧的.env文件
if [ -f .env ]; then
    cp .env .env.backup
    echo "✅ 已备份旧的.env文件为.env.backup"
fi

# 创建新的.env文件
cat > .env << EOL
# 新Aurora PostgreSQL集群配置
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@${WRITE_ENDPOINT}:5432/${DB_NAME}?schema=public"
DATABASE_WRITE_URL="postgresql://postgres:${DB_PASSWORD}@${WRITE_ENDPOINT}:5432/${DB_NAME}?schema=public"
DATABASE_READ_URL="postgresql://postgres:${DB_PASSWORD}@${READ_ENDPOINT}:5432/${DB_NAME}?schema=public"

# Next.js配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
EOL

echo "✅ 新的.env文件已创建"
echo ""

# 测试连接
echo "🧪 测试数据库连接..."
if command -v nc > /dev/null 2>&1; then
    HOST=$(echo $WRITE_ENDPOINT | cut -d':' -f1)
    if nc -z $HOST 5432 2>/dev/null; then
        echo "✅ 数据库端口可达"
    else
        echo "❌ 数据库端口不可达，请检查："
        echo "   - 安全组配置"
        echo "   - 公有访问设置"
        echo "   - 终端节点是否正确"
        exit 1
    fi
else
    echo "⚠️  无法测试端口连通性（nc命令不可用）"
fi

echo ""
echo "🚀 初始化数据库结构..."

# 推送数据库模式
if npm run db:push; then
    echo "✅ 数据库结构创建成功"
else
    echo "❌ 数据库结构创建失败"
    echo "请检查连接配置和数据库权限"
    exit 1
fi

echo ""
echo "🎉 配置完成！"
echo ""
echo "接下来你可以："
echo "1. 运行 'npm run dev' 启动开发服务器"
echo "2. 访问 http://localhost:3000 查看博客"
echo "3. 开始写你的第一篇博客！"
echo ""
echo "如果遇到问题，请检查："
echo "- AWS控制台中的数据库状态"
echo "- 安全组入站规则"
echo "- VPC和子网配置" 