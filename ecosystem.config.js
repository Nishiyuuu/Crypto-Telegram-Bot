module.exports = {
  apps: [
    {
      name: 'crypto-bot',
      script: 'src/bot.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8443
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      // Логи
      error_file: 'src/logs/pm2-error.log',
      out_file: 'src/logs/pm2-out.log',
      log_file: 'src/logs/pm2-combined.log',
      time: true,
      
      // Управління пам'яттю
      max_memory_restart: '1G',
      
      // Перезапуск
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Моніторинг
      watch: false,
      ignore_watch: ['node_modules', 'src/logs', 'backup'],
      
      // Автоматичний перезапуск
      cron_restart: '0 4 * * *', // Щодня о 4:00 ранку
      
      // Змінні середовища
      env_file: '.env'
    },
    {
      name: 'crypto-worker',
      script: 'src/worker.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      },
      // Логи
      error_file: 'src/logs/worker-error.log',
      out_file: 'src/logs/worker-out.log',
      log_file: 'src/logs/worker-combined.log',
      time: true,
      
      // Управління пам'яттю
      max_memory_restart: '512M',
      
      // Перезапуск
      restart_delay: 4000,
      max_restarts: 5,
      min_uptime: '10s',
      
      // Моніторинг
      watch: false,
      
      // Автоматичний перезапуск
      cron_restart: '0 3 * * *', // Щодня о 3:00 ранку
      
      // Змінні середовища
      env_file: '.env'
    }
  ],
  
  // Налаштування розгортання
  deploy: {
    production: {
      user: 'cryptobot',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/Crypto-Telegram-Bot.git',
      path: '/home/cryptobot/app',
      'post-deploy': 'npm ci --only=production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    },
    development: {
      user: 'cryptobot',
      host: ['dev-server-ip'],
      ref: 'origin/develop',
      repo: 'https://github.com/yourusername/Crypto-Telegram-Bot.git',
      path: '/home/cryptobot/app-dev',
      'post-deploy': 'npm ci && pm2 reload ecosystem.config.js --env development'
    }
  }
};
