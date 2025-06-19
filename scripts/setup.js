#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始设置个人博客项目...\n');

// 检查是否存在 .env 文件
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.local.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ 已创建 .env 文件，请配置你的数据库连接');
  } else {
    console.log('⚠️  请手动创建 .env 文件并配置数据库连接');
  }
} else {
  console.log('✅ .env 文件已存在');
}

try {
  console.log('\n📦 安装依赖包...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ 依赖包安装完成');

  console.log('\n🔧 生成 Prisma 客户端...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma 客户端生成完成');

  console.log('\n🎉 项目设置完成！');
  console.log('\n接下来的步骤：');
  console.log('1. 配置 .env 文件中的数据库连接');
  console.log('2. 运行 npm run db:push 推送数据库模式');
  console.log('3. 运行 npm run dev 启动开发服务器');
  console.log('\n访问 http://localhost:3000 查看你的博客 🎊');

} catch (error) {
  console.error('❌ 设置过程中出现错误:', error.message);
  process.exit(1);
} 