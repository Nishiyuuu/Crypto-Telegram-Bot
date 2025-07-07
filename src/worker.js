require('dotenv').config();
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const monitorPrices = require('./monitoring');
const User = require('./models/User');

const bot = new TelegramBot(process.env.BOT_TOKEN);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // Запускаємо моніторинг у циклі
    setInterval(async () => {
      const users = await User.find({ coins: { $exists: true, $not: { $size: 0 } } });
      for (const usr of users) {
        // Використовуємо налаштований інтервал і поріг для кожного користувача
        const interval = usr.monitorInterval || 15000;
        const threshold = usr.monitorThreshold || 0.5;

        const alerts = await monitorPrices(usr.coins, interval, threshold);
        for (const msg of alerts) {
          await bot.sendMessage(usr.telegramId, msg);
        }
      }
    }, 1000); // опитування бази кожну секунду, моніторинг всередині враховує свій інтервал
  })
  .catch(err => console.error('❌ MongoDB error:', err));
