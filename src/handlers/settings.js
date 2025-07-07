const User = require('../models/User');
const t    = require('../translate');
const sendMainMenu = require('../utils/sendMainMenu');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const user = await User.findOne({ telegramId: chatId });

    // Відкрити меню налаштувань
    if (query.data === 'menu:settings') {
      const keyboard = [
        [{ text: t(user.language, 'view_settings'), callback_data: 'settings:view' }],
        [{ text: t(user.language, 'change_language'), callback_data: 'lang_menu' }],
        [{ text: t(user.language, 'set_interval'), callback_data: 'settings:set_interval' }],
        [{ text: t(user.language, 'set_threshold'), callback_data: 'settings:set_threshold' }],
        [{ text: t(user.language, 'buy_vip'), callback_data: 'settings:buy' }],
        [{ text: t(user.language, 'back_main'), callback_data: 'menu:main' }]
      ];
      return bot.sendMessage(
        chatId,
        t(user.language, 'settings_menu'),
        { reply_markup: { inline_keyboard: keyboard } }
      );
    }

    // Показати поточні налаштування
    if (query.data === 'settings:view') {
      const text = 
        `${t(user.language, 'status')}: ${user.status.toUpperCase()}\n` +
        `${t(user.language, 'interval')}: ${ (user.monitorInterval/1000).toFixed(0) }s\n` +
        `${t(user.language, 'threshold')}: ${ user.monitorThreshold }%\n` +
        `${t(user.language, 'coins')}: ${ user.coins.join(', ') || t(user.language, 'no_coins') }`;
      await bot.sendMessage(chatId, text);
      return sendMainMenu(bot, chatId, user.language);
    }

    // Перенаправлення на встановлення інтервалу/порогу/крону – ці хендлери вже є
    if (query.data === 'settings:set_interval') {
      // Викликаємо той же setIntervalHandler, що і в monitoring.js
      const maxInterval = user.status === 'vip' ? 60 : 600;
      await bot.sendMessage(chatId, t(user.language, 'enter_interval').replace('{max}', maxInterval));
      return bot.once('message', setIntervalHandler(bot, chatId, maxInterval * 1000));
    }

    if (query.data === 'settings:set_threshold') {
      const maxThreshold = user.status === 'vip' ? 5 : 10;
      await bot.sendMessage(chatId, t(user.language, 'enter_threshold').replace('{max}', maxThreshold));
      return bot.once('message', setThresholdHandler(bot, chatId, maxThreshold));
    }

    // Придбати VIP
    if (query.data === 'settings:buy') {
      await bot.sendMessage(chatId, t(user.language, 'contact_admin'));
      return sendMainMenu(bot, chatId, user.language);
    }

    // Назад
    /*if (query.data === 'menu:main') {
      return sendMainMenu(bot, chatId, user.language);
    }*/
  });
};
