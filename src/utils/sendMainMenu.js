const t = require('../translate');

function sendMainMenu(bot, chatId, lang) {
  const inlineKeyboard = [
    [{ text: t(lang, 'check_price'), callback_data: 'menu:price' }],
    [{ text: t(lang, 'monitoring'),  callback_data: 'menu:monitor' }],
    [{ text: t(lang, 'settings'),    callback_data: 'menu:settings' }],
    [{ text: t(lang, 'help'),        callback_data: 'menu:help' }],
    [{ text: '⚠️ Disclaimer', callback_data: 'menu:disclaimer' }]
  ];

  return bot.sendMessage(chatId, t(lang, 'main_menu'), {
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}

module.exports = sendMainMenu;
