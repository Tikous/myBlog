#!/bin/bash

echo "🚀 腾讯云轻量服务器环境配置脚本"
echo "=================================="

# 更新系统
echo "📦 更新系统包..."
sudo apt update && sudo apt upgrade -y

# 安装必要软件
echo "🔧 安装基础软件..."
sudo apt install -y curl wget git vim nginx

# 安装Node.js 18.x
echo "📦 安装Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
echo "✅ 验证安装版本："
node --version
npm --version

# 安装PM2（进程管理器）
echo "🔄 安装PM2进程管理器..."
sudo npm install -g pm2

# 安装pnpm（可选，更快的包管理器）
sudo npm install -g pnpm

# 创建应用目录
echo "📁 创建应用目录..."
sudo mkdir -p /var/www/myblog
sudo chown -R $USER:$USER /var/www/myblog

# 配置防火墙
echo "🔒 配置防火墙..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable

echo "✅ 服务器环境配置完成！"
echo ""
echo "接下来步骤："
echo "1. 克隆你的项目到 /var/www/myblog"
echo "2. 配置环境变量"
echo "3. 安装依赖并构建项目"
echo "4. 配置PM2和Nginx" 