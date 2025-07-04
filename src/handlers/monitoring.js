const User = require('../models/User');
const t = require('../translate');

function sendMainMenu(bot, chatId, lang) {
  const menu = [
    [{ text: t(lang, 'price_check'), callback_data: 'menu:price' }],
    [{ text: t(lang, 'monitoring'),  callback_data: 'menu:monitor' }],
    [{ text: t(lang, 'settings'),    callback_data: 'menu:settings' }],
    [{ text: t(lang, 'help'),        callback_data: 'menu:help' }]
  ];
  return bot.sendMessage(chatId, t(lang, 'main_menu'), {
    reply_markup: { inline_keyboard: menu }
  });
}
module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const user = await User.findOne({ telegramId: chatId });
    if (query.data === 'menu:monitor') {
      if (!user.coins.length) {
        bot.sendMessage(chatId, t(user.language,'enter_coins'));
        bot.once('message', async (msg) => {
          const coins = msg.text.split(/\s*,\s*/).map(c => c.toUpperCase());
          const max = user.status === 'vip' ? 5 : 2;
          user.coins = coins.slice(0, max);
          await user.save();
          bot.sendMessage(chatId, t(user.language,'monitoring_set') + user.coins.join(','));
          await bot.sendMessage(chatId, t(user.language,'monitoring_set') + user.coins.join(','));
          await sendMainMenu(bot, chatId, user.language);
        });
      } else {
        const keyboard = [
          [{ text: t(user.language,'edit_coins'), callback_data: 'monitor:edit' }],
          [{ text: t(user.language,'back_main'), callback_data: 'menu:main' }]
        ];
        bot.sendMessage(chatId, t(user.language,'your_coins') + user.coins.join(','), { reply_markup: { inline_keyboard: keyboard } });
      }
    }
    if (query.data === 'monitor:edit') {
      user.coins = [];
      await user.save();
      bot.sendMessage(chatId, t(user.language,'enter_coins'));
    }
    if (query.data === 'menu:main') {
        const chatId = query.message.chat.id;
        const user   = await User.findOne({ telegramId: chatId });
        return sendMainMenu(bot, chatId, user.language);
    }
  });
};