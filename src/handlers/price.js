const t = require('../translate');
const User = require('../models/User');
const Binance = require('binance-api-node').default;
const client = Binance();

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const user = await User.findOne({ telegramId: chatId });
    if (query.data === 'menu:price') {
      bot.sendMessage(chatId, t(user.language,'enter_symbol'));
      bot.once('message', async (msg) => {
        const symbol = msg.text.trim().toUpperCase();
        try {
          const prices = await client.prices({ symbol });
          const price = prices[symbol];
          bot.sendMessage(chatId, t(user.language,'current_price') + price);
        } catch (e) {
          bot.sendMessage(chatId, t(user.language,'invalid_symbol'));
        }
      });
    }
  });
};