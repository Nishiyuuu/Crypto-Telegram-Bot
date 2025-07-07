// src/handlers/mainMenu.js
const User = require('../models/User');
const sendMainMenu = require('../utils/sendMainMenu');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    if (query.data === 'menu:main') {
      const chatId = query.message.chat.id;
      const user   = await User.findOne({ telegramId: chatId });
      return sendMainMenu(bot, chatId, user.language);
    }
  });
};
