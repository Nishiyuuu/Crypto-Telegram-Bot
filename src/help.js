const t = require('../translate');
const User = require('../models/User');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const user = await User.findOne({ telegramId: chatId });
    if (query.data === 'menu:help') {
      bot.sendMessage(chatId, t(user.language,'help_text'));
    }
  });
};