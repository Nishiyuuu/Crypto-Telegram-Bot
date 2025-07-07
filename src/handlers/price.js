const t = require('../translate');
const User = require('../models/User');
const Binance = require('binance-api-node').default;
const client = Binance();
const sendMainMenu = require('../utils/sendMainMenu');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const user = await User.findOne({ telegramId: chatId });

    if (query.data === 'menu:price') {
      return promptSymbol(bot, chatId, user.language);
    }
  });
};

// Функція для запиту та обробки символу
async function promptSymbol(bot, chatId, lang) {
  await bot.sendMessage(chatId, t(lang, 'enter_symbol'));
  bot.once('message', async (msg) => {
    const symbol = msg.text.trim().toUpperCase();
    try {
      const prices = await client.prices({ symbol });
      const price = prices[symbol];
      await bot.sendMessage(chatId, t(lang, 'current_price') + price);
    } catch {
      await bot.sendMessage(chatId, t(lang, 'invalid_symbol'));
    }
    // Повернення в головне меню після показу ціни або помилки
    return sendMainMenu(bot, chatId, lang);
  });
}
