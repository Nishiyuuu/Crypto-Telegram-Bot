require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');
const logger = require('./utils/logger');

const t = require('./translate');

// Перевірка env
if (!process.env.BOT_TOKEN || !process.env.MONGO_URI) {
  logger.error('Не задані BOT_TOKEN або MONGO_URI у .env');
  throw new Error('Не задані BOT_TOKEN або MONGO_URI у .env');
}

// Перевірка на вже запущений екземпляр
const pidFile = path.join(__dirname, '..', '.bot.pid');
if (fs.existsSync(pidFile)) {
  const existingPid = fs.readFileSync(pidFile, 'utf8').trim();
  logger.warn(`⚠️ Знайдено PID файл з процесом ${existingPid}`);
  
  try {
    // Перевіряємо, чи процес дійсно запущений
    process.kill(existingPid, 0);
    logger.error('❌ Бот вже запущений! Зупиніть поточний екземпляр командою: npm run stop');
    process.exit(1);
  } catch (err) {
    // Процес не запущений, видаляємо старий PID файл
    logger.info('🧹 Видаляю застарілий PID файл');
    fs.unlinkSync(pidFile);
  }
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { 
  polling: {
    interval: 1000,
    autoStart: false
  }
});

// Записуємо PID поточного процесу після успішної перевірки
fs.writeFileSync(pidFile, process.pid.toString());
logger.info(`📝 Записано PID ${process.pid} в файл ${pidFile}`);

// Запускаємо polling з затримкою
setTimeout(() => {
  logger.info('🚀 Запуск Telegram polling...');
  bot.startPolling();
}, 2000);

// Обробка помилок бота
bot.on('error', (error) => {
  logger.error('Telegram bot error:', error);
});

bot.on('polling_error', (error) => {
  logger.error('Polling error:', error);
  
  // Спеціальна обробка конфлікту (409)
  if (error.code === 'ETELEGRAM' && error.response && error.response.statusCode === 409) {
    logger.error('❌ КОНФЛІКТ: Інший екземпляр бота вже запущено!');
    logger.error('🛑 Зупиняю поточний екземпляр та видаляю PID файл...');
    
    // Видаляємо PID файл при конфлікті
    const pidFile = path.join(__dirname, '..', '.bot.pid');
    if (fs.existsSync(pidFile)) {
      fs.unlinkSync(pidFile);
      logger.info('🧹 PID файл видалено');
    }
    
    // Зупиняємо polling перед виходом
    bot.stopPolling();
    setTimeout(() => process.exit(1), 1000);
    return;
  }
  
  // Інші помилки - повторний запуск polling через 5 секунд
  setTimeout(() => {
    logger.info('🔄 Спроба відновлення polling...');
    bot.startPolling();
  }, 5000);
});

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('✅ MongoDB connected');
  })
  .catch(err => {
    logger.error('❌ MongoDB error:', err);
    process.exit(1);
  });

// Динамічне завантаження хендлерів
const handlersDir = path.join(__dirname, 'handlers');
fs.readdirSync(handlersDir).forEach(file => {
  if (file.endsWith('.js')) {
    try {
      require(path.join(handlersDir, file))(bot);
      logger.info(`✅ Handler loaded: ${file}`);
    } catch (error) {
      logger.error(`❌ Error loading handler ${file}:`, error);
    }
  }
});


// /start — лише пропозиція вибору мови
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  logger.info(`New user started bot: ${userId} (${msg.from.username || 'no username'})`);
  
  try {
    let user = await User.findOne({ telegramId: chatId });
    if (!user) {
      user = new User({ telegramId: chatId });
      await user.save();
      logger.info(`New user created: ${userId}`);
    }

    const langs = ['uk', 'ru', 'be', 'en'];
    const keyboard = langs.map(code => [{
      text: t(code, 'language_name'),
      callback_data: `lang:${code}`
    }]);

    await bot.sendMessage(chatId, t(user.language, 'choose_language'), {
      reply_markup: { inline_keyboard: keyboard }
    });
  } catch (error) {
    logger.error(`Error in /start command for user ${userId}:`, error);
    await bot.sendMessage(chatId, 'Помилка запуску бота. Спробуйте пізніше.');
  }
});

// Обробка помилок процесу
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Bot shutting down...');
  
  // Видаляємо PID файл
  const pidFile = path.join(__dirname, '..', '.bot.pid');
  if (fs.existsSync(pidFile)) {
    fs.unlinkSync(pidFile);
    logger.info('🧹 PID файл видалено');
  }
  
  bot.stopPolling();
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Bot terminated...');
  
  // Видаляємо PID файл
  const pidFile = path.join(__dirname, '..', '.bot.pid');
  if (fs.existsSync(pidFile)) {
    fs.unlinkSync(pidFile);
    logger.info('🧹 PID файл видалено');
  }
  
  bot.stopPolling();
  mongoose.connection.close();
  process.exit(0);
});

module.exports = bot;
