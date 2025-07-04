const t = require('../translate');
const User = require('../models/User');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const user = await User.findOne({ telegramId: chatId });
    if (query.data === 'menu:settings') {
      const keyboard = [
        [{ text: t(user.language,'change_language'), callback_data: 'lang_menu' }],
        [{ text: t(user.language,'buy_vip'), callback_data: 'settings:buy' }],
        [{ text: t(user.language,'back_main'), callback_data: 'menu:main' }]
      ];
      bot.sendMessage(chatId, t(user.language,'settings_menu'), { reply_markup: { inline_keyboard: keyboard } });
    }
    if (query.data === 'settings:buy') {
      bot.sendMessage(chatId, t(user.language,'contact_admin'));
    }
    if (query.data === 'lang_menu') {
      const langs = ['uk','ru','be','en'];
      const kb = langs.map(code => [{ text: t(code,'language_name'), callback_data: `lang:${code}` }]);
      bot.sendMessage(chatId, t(user.language,'choose_language'), { reply_markup: { inline_keyboard: kb } });
    }
  });
};
