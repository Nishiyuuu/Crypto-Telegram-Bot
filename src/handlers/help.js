const User = require('../models/User');
const t = require('../translate');
const sendMainMenu = require('../utils/sendMainMenu');

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const user = await User.findOne({ telegramId: chatId });

    if (query.data === 'menu:help') {
      const inlineKeyboard = [
        [
          { text: t(user.language, 'how_to_use'), callback_data: 'help:how_to_use' },
          { text: t(user.language, 'features'), callback_data: 'help:features' }
        ],
        [
          { text: t(user.language, 'faq'), callback_data: 'help:faq' },
          { text: t(user.language, 'contact'), callback_data: 'help:contact' }
        ],
        [{ text: t(user.language, 'back_to_menu'), callback_data: 'menu:main' }]
      ];

      await bot.sendMessage(chatId, t(user.language, 'help_text'), {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: inlineKeyboard }
      });
    }

    if (query.data === 'help:faq') {
      const inlineKeyboard = [
        [{ text: t(user.language, 'back_to_help'), callback_data: 'menu:help' }],
        [{ text: t(user.language, 'back_to_menu'), callback_data: 'menu:main' }]
      ];

      await bot.sendMessage(chatId, t(user.language, 'faq_text'), {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: inlineKeyboard }
      });
    }

    if (query.data === 'help:contact') {
      const inlineKeyboard = [
        [{ text: t(user.language, 'back_to_help'), callback_data: 'menu:help' }],
        [{ text: t(user.language, 'back_to_menu'), callback_data: 'menu:main' }]
      ];

      await bot.sendMessage(chatId, t(user.language, 'contact_info'), {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: inlineKeyboard }
      });
    }

    if (query.data === 'help:how_to_use') {
      const inlineKeyboard = [
        [{ text: t(user.language, 'back_to_help'), callback_data: 'menu:help' }],
        [{ text: t(user.language, 'back_to_menu'), callback_data: 'menu:main' }]
      ];

      await bot.sendMessage(chatId, t(user.language, 'how_to_use_text'), {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: inlineKeyboard }
      });
    }

    if (query.data === 'help:features') {
      const inlineKeyboard = [
        [{ text: t(user.language, 'back_to_help'), callback_data: 'menu:help' }],
        [{ text: t(user.language, 'back_to_menu'), callback_data: 'menu:main' }]
      ];

      await bot.sendMessage(chatId, t(user.language, 'features_text'), {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: inlineKeyboard }
      });
    }
  });
};
