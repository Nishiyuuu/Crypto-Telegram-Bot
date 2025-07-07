require('dotenv').config();
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const monitorPrices = require('./monitoring');
const User = require('./models/User');
const logger = require('./utils/logger');

const bot = new TelegramBot(process.env.BOT_TOKEN);

let isRunning = false;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('✅ MongoDB connected');
    startMonitoring();
  })
  .catch(err => {
    logger.error('❌ MongoDB error:', err);
    process.exit(1);
  });

async function startMonitoring() {
  if (isRunning) return;
  isRunning = true;
  
  logger.info('🔄 Starting monitoring service...');
  
  const runMonitoring = async () => {
    try {
      const users = await User.find({ 
        coins: { $exists: true, $not: { $size: 0 } } 
      });
      
      logger.info(`Monitoring ${users.length} users`);
      
      for (const user of users) {
        try {
          const interval = user.monitorInterval || 15000;
          const threshold = user.monitorThreshold || 0.5;

          const alerts = await monitorPrices(user.coins, interval, threshold);
          
          for (const message of alerts) {
            try {
              await bot.sendMessage(user.telegramId, message);
              logger.info(`Alert sent to user ${user.telegramId}`);
              // Мала пауза між повідомленнями
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
              logger.error(`Error sending message to ${user.telegramId}:`, error.message);
            }
          }
        } catch (error) {
          logger.error(`Error monitoring user ${user.telegramId}:`, error.message);
        }
      }
    } catch (error) {
      logger.error('Error in monitoring cycle:', error.message);
    }
  };
  
  // Запускаємо моніторинг кожні 15 секунд
  setInterval(runMonitoring, 15000);
  
  // Запускаємо перший цикл одразу
  runMonitoring();
}

// Обробка помилок процесу
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Обробка сигналів завершення
process.on('SIGINT', () => {
  logger.info('🛑 Stopping monitoring service...');
  isRunning = false;
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('🛑 Stopping monitoring service...');
  isRunning = false;
  process.exit(0);
});
