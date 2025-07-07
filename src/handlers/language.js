const User = require('../models/User');
const t = require('../translate');
const sendMainMenu = require('../utils/sendMainMenu');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const [action, code] = query.data.split(':');
    const chatId = query.message.chat.id;

    // Відкрити меню вибору мови
    if (query.data === 'lang_menu') {
      const user = await User.findOne({ telegramId: chatId });
      const langs = ['uk', 'ru', 'be', 'en'];
      const keyboard = langs.map(langCode => [{
        text: t(langCode, 'language_name'),
        callback_data: `lang:${langCode}`
      }]);

      return bot.sendMessage(chatId, t(user.language, 'choose_language'), {
        reply_markup: { inline_keyboard: keyboard }
      });
    }

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
