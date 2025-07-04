const User = require('../models/User');
const t = require('../translate');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const [action, code] = query.data.split(':');
    const chatId = query.message.chat.id;

    if (action === 'lang') {
      // Зберігаємо мову
      const user = await User.findOneAndUpdate(
        { telegramId: chatId },
        { language: code },
        { new: true }
      );

      // Відправляємо опис та головне меню одразу після вибору мови
      await bot.sendMessage(chatId, t(code, 'language_set'));
      await bot.sendMessage(chatId, t(code, 'description'));

      const menu = [
        [{ text: t(code, 'price_check'), callback_data: 'menu:price' }],
        [{ text: t(code, 'monitoring'), callback_data: 'menu:monitor' }],
        [{ text: t(code, 'settings'), callback_data: 'menu:settings' }],
        [{ text: t(code, 'help'), callback_data: 'menu:help' }]
      ];
      await bot.sendMessage(chatId, t(code, 'main_menu'), {
        reply_markup: { inline_keyboard: menu }
      });
    }
  });
};
