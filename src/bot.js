require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');
const t = require('./translate');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Завантажуємо хендлери динамічно
const handlersDir = path.join(__dirname, 'handlers');
fs.readdirSync(handlersDir).forEach((file) => {
  if (file.endsWith('.js')) {
    require(path.join(handlersDir, file))(bot);
  }
});

// Стартове повідомлення /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  let user = await User.findOne({ telegramId: chatId });
  if (!user) {
    user = new User({ telegramId: chatId });
    await user.save();
  }
  // Пропонуємо вибір мови
  const langs = ['uk', 'ru', 'be', 'en'];
  const keyboard = langs.map(code => [{ text: t(code,'language_name'), callback_data: `lang:${code}` }]);
  await bot.sendMessage(chatId, t(user.language,'choose_language'), { reply_markup: { inline_keyboard: keyboard } });
});

module.exports = bot;