# 腾讯云轻量应用服务器部署指南

## 📋 部署步骤

### 1. 服务器环境准备

```bash
# 上传并运行服务器配置脚本
chmod +x deploy-scripts/server-setup.sh
./deploy-scripts/server-setup.sh
```

### 2. 配置环境变量

在服务器上创建 `.env` 文件：

```bash
# 进入项目目录
cd /var/www/myblog

# 创建环境变量文件
vim .env
```

`.env` 文件内容：
```env
# 数据库连接（Aurora PostgreSQL）
DATABASE_URL="postgresql://postgres:your-password@your-aurora-endpoint:5432/blog_db?schema=public"
DATABASE_WRITE_URL="postgresql://postgres:your-password@write-endpoint:5432/blog_db?schema=public"
DATABASE_READ_URL="postgresql://postgres:your-password@read-endpoint:5432/blog_db?schema=public"

# Next.js配置
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# 生产环境
NODE_ENV="production"
```

### 3. 部署应用

```bash
# 运行部署脚本
chmod +x deploy-scripts/deploy.sh
./deploy-scripts/deploy.sh
```

### 4. 启动应用

```bash
# 使用PM2在80端口启动应用
sudo pm2 start npm --name "myblog" -- start -- --port 80

# 保存PM2配置
sudo pm2 save
sudo pm2 startup
```

### 5. 验证部署

```bash
# 查看应用状态
pm2 status

# 查看应用日志
pm2 logs myblog

# 测试访问
curl http://localhost:80
```

现在可以通过浏览器访问：`http://你的服务器IP` 