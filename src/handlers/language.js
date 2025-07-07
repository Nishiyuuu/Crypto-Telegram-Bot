const User = require('../models/User');
const t = require('../translate');
const sendMainMenu = require('../utils/sendMainMenu');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const [action, code] = query.data.split(':');
    const chatId = query.message.chat.id;

    if (action === 'lang') {
      const user = await User.findOneAndUpdate(
        { telegramId: chatId },
        { language: code },
        { new: true }
      );

      // Підтвердження, опис і головне меню
      await bot.sendMessage(chatId, t(code, 'language_set'));
      await bot.sendMessage(chatId, t(code, 'description'));
      return sendMainMenu(bot, chatId, code);
    }
  });
};
