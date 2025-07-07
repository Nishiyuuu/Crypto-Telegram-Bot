require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');

const t = require('./translate');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Перевірка env
if (!process.env.BOT_TOKEN || !process.env.MONGO_URI) {
  throw new Error('Не задані BOT_TOKEN або MONGO_URI у .env');
}

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Динамічне завантаження хендлерів
// src/bot.js
const handlersDir = path.join(__dirname, 'handlers');
fs.readdirSync(handlersDir).forEach(file => {
  if (file.endsWith('.js')) {
    require(path.join(handlersDir, file))(bot);
  }
});


// /start — лише пропозиція вибору мови
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  let user = await User.findOne({ telegramId: chatId });
  if (!user) {
    user = new User({ telegramId: chatId });
    await user.save();
  }

  const langs = ['uk', 'ru', 'be', 'en'];
  const keyboard = langs.map(code => [{
    text: t(code, 'language_name'),
    callback_data: `lang:${code}`
  }]);

  await bot.sendMessage(chatId, t(user.language, 'choose_language'), {
    reply_markup: { inline_keyboard: keyboard }
    
  });
});

module.exports = bot;
