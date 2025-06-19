#!/bin/bash

echo "🔒 配置SSL证书（Let's Encrypt）"
echo "=============================="

# 检查域名参数
if [ -z "$1" ]; then
    echo "❌ 请提供域名参数"
    echo "用法: ./ssl-setup.sh your-domain.com"
    exit 1
fi

DOMAIN=$1
EMAIL="your-email@example.com"  # 替换为你的邮箱

echo "📋 配置信息："
echo "域名: $DOMAIN"
echo "邮箱: $EMAIL"
echo ""

# 安装Certbot
echo "📦 安装Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 检查Nginx配置
echo "🔧 检查Nginx配置..."
sudo nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx配置有误，请检查配置文件"
    exit 1
fi

# 获取SSL证书
echo "🔒 获取SSL证书..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

if [ $? -eq 0 ]; then
    echo "✅ SSL证书配置成功！"
    
    # 测试自动续期
    echo "🔄 测试证书自动续期..."
    sudo certbot renew --dry-run
    
    if [ $? -eq 0 ]; then
        echo "✅ 自动续期配置成功！"
    else
        echo "⚠️  自动续期配置可能有问题"
    fi
    
    # 重启Nginx
    echo "🔄 重启Nginx..."
    sudo systemctl restart nginx
    
    echo ""
    echo "🎉 SSL配置完成！"
    echo "🌐 现在可以通过HTTPS访问: https://$DOMAIN"
    
else
    echo "❌ SSL证书配置失败"
    echo "请检查："
    echo "1. 域名是否正确解析到服务器IP"
    echo "2. 防火墙是否开放80和443端口"
    echo "3. Nginx是否正常运行"
fi

echo ""
echo "📝 证书信息："
sudo certbot certificates 