# Aurora PostgreSQL 读写分离配置指南

## 🔍 你的数据库架构分析

根据截图，你的Aurora集群配置：
- **集群名称**: database-1
- **写入实例**: database-1-instance-1 (主实例)
- **读取实例**: database-1-instance-1-ap-southeast-* (副本实例)
- **区域**: ap-southeast-2 (悉尼)

## 🌐 获取Aurora集群终端节点

### 1. 在AWS RDS控制台获取终端节点

在你的Aurora集群详情页面，你会看到以下终端节点：

```
集群终端节点（写入）: database-1.cluster-xxxxx.ap-southeast-2.rds.amazonaws.com
集群只读终端节点（读取）: database-1.cluster-ro-xxxxx.ap-southeast-2.rds.amazonaws.com
```

### 2. 实例终端节点（备用方案）

如果找不到集群终端节点，可以使用实例终端节点：
```
写入实例: database-1-instance-1.c1ckku6quofn.ap-southeast-2.rds.amazonaws.com
读取实例: database-1-instance-1-ap-southeast-*.c1ckku6quofn.ap-southeast-2.rds.amazonaws.com
```

## 🔧 环境变量配置

在项目根目录创建 `.env` 文件：

### 方案1：使用集群终端节点（推荐）

```env
# Aurora集群连接配置
DATABASE_URL="postgresql://postgres:你的密码@database-1.cluster-xxxxx.ap-southeast-2.rds.amazonaws.com:5432/blog_db?schema=public"
DATABASE_WRITE_URL="postgresql://postgres:你的密码@database-1.cluster-xxxxx.ap-southeast-2.rds.amazonaws.com:5432/blog_db?schema=public"
DATABASE_READ_URL="postgresql://postgres:你的密码@database-1.cluster-ro-xxxxx.ap-southeast-2.rds.amazonaws.com:5432/blog_db?schema=public"

# Next.js配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 方案2：使用实例终端节点

```env
# Aurora实例连接配置
DATABASE_URL="postgresql://postgres:你的密码@database-1-instance-1.c1ckku6quofn.ap-southeast-2.rds.amazonaws.com:5432/blog_db?schema=public"
DATABASE_WRITE_URL="postgresql://postgres:你的密码@database-1-instance-1.c1ckku6quofn.ap-southeast-2.rds.amazonaws.com:5432/blog_db?schema=public"
DATABASE_READ_URL="postgresql://postgres:你的密码@database-1-instance-1-ap-southeast-xxx.c1ckku6quofn.ap-southeast-2.rds.amazonaws.com:5432/blog_db?schema=public"

# Next.js配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## 🔐 安全组配置

确保你的Aurora集群安全组允许访问：

1. **找到安全组**
   - 在RDS控制台，点击你的集群名称
   - 查看"连接和安全性"部分的VPC安全组

2. **编辑入站规则**
   ```
   类型: PostgreSQL
   协议: TCP
   端口: 5432
   源: 你的IP地址/32 或 0.0.0.0/0（测试用）
   ```

## 🚀 启动和测试

### 1. 配置完成后，推送数据库模式

```bash
# 推送数据库结构到Aurora
npm run db:push
```

### 2. 启动开发服务器

```bash
# 启动项目
npm run dev
```

### 3. 测试读写分离

项目现在会自动：
- **读操作**（查询博客列表、博客详情）→ 使用读取副本
- **写操作**（创建博客、更新数据）→ 使用主实例

## 📊 读写分离的优势

1. **性能提升**: 读取请求分散到副本实例
2. **高可用性**: 主实例故障时，副本可以提升为主实例
3. **负载均衡**: 减轻主实例压力
4. **扩展性**: 可以添加更多读取副本

## 🔧 故障排除

### 连接超时
- 检查安全组配置
- 确认"公开访问"设置为"是"
- 验证VPC和子网配置

### 读写分离不工作
- 检查环境变量是否正确设置
- 确认读取副本状态为"可用"
- 查看Aurora集群状态

### 找不到集群终端节点
1. 在RDS控制台，选择"数据库"
2. 点击你的集群名称（不是实例）
3. 在"连接和安全性"部分查看终端节点

## 💡 最佳实践

1. **使用集群终端节点**而不是实例终端节点
2. **监控读写比例**，根据需要调整副本数量
3. **定期备份**，启用自动备份
4. **监控性能**，使用CloudWatch监控

配置完成后，你的博客将具备高性能的读写分离架构！🎉 