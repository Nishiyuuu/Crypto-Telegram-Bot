const User = require('../models/User');
const t    = require('../translate');
const sendMainMenu = require('../utils/sendMainMenu');

// Зберігаємо активні обробники для кожного користувача
const activeHandlers = new Map();

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

    // Перенаправлення на встановлення інтервалу/порогу
    if (query.data === 'settings:set_interval') {
      const maxInterval = user.status === 'vip' ? 60 : 600;
      await bot.sendMessage(chatId, t(user.language, 'enter_interval').replace('{max}', maxInterval));
      return setIntervalHandler(bot, chatId, maxInterval * 1000);
    }

    if (query.data === 'settings:set_threshold') {
      const maxThreshold = user.status === 'vip' ? 5 : 10;
      await bot.sendMessage(chatId, t(user.language, 'enter_threshold').replace('{max}', maxThreshold));
      return setThresholdHandler(bot, chatId, maxThreshold);
    }

    // Придбати VIP
    if (query.data === 'settings:buy') {
      await bot.sendMessage(chatId, t(user.language, 'contact_admin'));
      return sendMainMenu(bot, chatId, user.language);
    }
  });
};

function setIntervalHandler(bot, chatId, maxInterval) {
  // Видаляємо попередній обробник для цього користувача
  if (activeHandlers.has(chatId)) {
    bot.removeListener('message', activeHandlers.get(chatId));
  }
  
  const handler = async (msg) => {
    // Перевіряємо, що повідомлення від того ж користувача
    if (msg.chat.id !== chatId) return;
    
    // Видаляємо обробник після використання
    bot.removeListener('message', handler);
    activeHandlers.delete(chatId);
    
    const user = await User.findOne({ telegramId: chatId });
    let sec = parseInt(msg.text, 10);
    sec = isNaN(sec) || sec < 1 ? 1 : sec;
    const ms = Math.min(sec * 1000, maxInterval);
    user.monitorInterval = ms;
    await user.save();
    await bot.sendMessage(
      chatId,
      t(user.language, 'interval_set').replace('{sec}', ms/1000)
    );
    return sendMainMenu(bot, chatId, user.language);
  };
  
  activeHandlers.set(chatId, handler);
  bot.on('message', handler);
}

function setThresholdHandler(bot, chatId, maxThreshold) {
  // Видаляємо попередній обробник для цього користувача
  if (activeHandlers.has(chatId)) {
    bot.removeListener('message', activeHandlers.get(chatId));
  }
  
  const handler = async (msg) => {
    // Перевіряємо, що повідомлення від того ж користувача
    if (msg.chat.id !== chatId) return;
    
    // Видаляємо обробник після використання
    bot.removeListener('message', handler);
    activeHandlers.delete(chatId);
    
    const user = await User.findOne({ telegramId: chatId });
    let pct = parseFloat(msg.text);
    pct = isNaN(pct) || pct < 0.1 ? 0.1 : pct;
    pct = Math.min(pct, maxThreshold);
    user.monitorThreshold = pct;
    await user.save();
    await bot.sendMessage(
      chatId,
      t(user.language, 'threshold_set').replace('{pct}', pct)
    );
    return sendMainMenu(bot, chatId, user.language);
  };
  
  activeHandlers.set(chatId, handler);
  bot.on('message', handler);
}
