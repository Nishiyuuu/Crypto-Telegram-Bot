const User = require('../models/User');
const t = require('../translate');
const sendMainMenu = require('../utils/sendMainMenu');

module.exports = (bot) => {
  // Команда /disclaimer
  bot.onText(/\/disclaimer/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({ telegramId: chatId }) || { language: 'en' };
    
    await bot.sendMessage(chatId, t(user.language, 'disclaimer'), {
      parse_mode: 'Markdown'
    });
    
    return sendMainMenu(bot, chatId, user.language);
  });

  // Callback для показу disclaimer з меню
  bot.on('callback_query', async (query) => {
    if (query.data === 'menu:disclaimer') {
      const chatId = query.message.chat.id;
      const user = await User.findOne({ telegramId: chatId }) || { language: 'en' };
      
      await bot.sendMessage(chatId, t(user.language, 'disclaimer'), {
        parse_mode: 'Markdown'
      });
      
      return sendMainMenu(bot, chatId, user.language);
    }
  });
};
