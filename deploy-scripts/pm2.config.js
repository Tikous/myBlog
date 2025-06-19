module.exports = {
  apps: [
    {
      name: 'myblog',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/myblog',
      instances: 1, // 可以设置为 'max' 使用所有CPU核心
      exec_mode: 'fork', // 或 'cluster'
      
      // 环境变量
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // 日志配置
      log_file: '/var/log/myblog/combined.log',
      out_file: '/var/log/myblog/out.log',
      error_file: '/var/log/myblog/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 自动重启配置
      watch: false, // 生产环境建议关闭
      ignore_watch: [
        'node_modules',
        '.next',
        'logs',
        '.git'
      ],
      
      // 内存和CPU限制
      max_memory_restart: '500M',
      
      // 重启策略
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // 健康检查
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // 高级配置
      node_args: '--max-old-space-size=512',
      
      // 合并日志
      merge_logs: true,
      
      // 时间戳
      time: true,
    }
  ]
}; 