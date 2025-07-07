const User = require('../models/User');
const t = require('../translate');
const sendMainMenu = require('../utils/sendMainMenu');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const user = await User.findOne({ telegramId: chatId });

    if (query.data === 'menu:help') {
      await bot.sendMessage(chatId, t(user.language, 'help_text'));
      return sendMainMenu(bot, chatId, user.language);
    }

    /*if (query.data === 'menu:main') {
      return sendMainMenu(bot, chatId, user.language);
    }*/
  });
};
