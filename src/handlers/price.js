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
  
  // Створюємо обробник для одного повідомлення
  const messageHandler = async (msg) => {
    // Перевіряємо, що повідомлення від того ж користувача
    if (msg.chat.id !== chatId) return;
    
    // Видаляємо обробник після використання
    bot.removeListener('message', messageHandler);
    
    const symbol = msg.text.trim().toUpperCase();
    try {
      const ticker = await client.dailyStats({ symbol });
      const price = parseFloat(ticker.lastPrice).toFixed(8);
      await bot.sendMessage(chatId, t(lang, 'current_price') + price + ' USDT');
    } catch (error) {
      await bot.sendMessage(chatId, t(lang, 'invalid_symbol'));
    }
    // Повернення в головне меню після показу ціни або помилки
    return sendMainMenu(bot, chatId, lang);
  };
  
  bot.on('message', messageHandler);
}
