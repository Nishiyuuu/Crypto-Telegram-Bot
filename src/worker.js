require('dotenv').config();
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const monitorPrices = require('./monitoring');
const User = require('./models/User');

const bot = new TelegramBot(process.env.BOT_TOKEN);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  setInterval(async () => {
    const users = await User.find({ coins: { $exists: true, $not: { $size: 0 } } });
    for (const user of users) {
      const alerts = await monitorPrices(user.coins, 0, 0.5);
      alerts.forEach(msg => bot.sendMessage(user.telegramId, msg));
    }
  }, 15000);
});