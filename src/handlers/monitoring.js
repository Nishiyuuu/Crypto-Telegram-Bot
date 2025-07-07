const User = require('../models/User');
const t = require('../translate');
const sendMainMenu = require('../utils/sendMainMenu');
const Binance = require('binance-api-node').default;
const client = Binance();

module.exports = (bot) => {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    let user = await User.findOne({ telegramId: chatId });

    if (query.data === 'menu:monitor') {
      if (!user.coins || user.coins.length === 0) {
        await bot.sendMessage(chatId, t(user.language, 'enter_coins'));
        return bot.once('message', addCoinsHandler(bot, chatId));
      }
      const keyboard = [
        [{ text: t(user.language, 'set_interval'), callback_data: 'monitor:set_interval' }],
        [{ text: t(user.language, 'set_threshold'), callback_data: 'monitor:set_threshold' }],
        [{ text: t(user.language, 'edit_coins'), callback_data: 'monitor:edit' }],
        [{ text: t(user.language, 'back_main'), callback_data: 'menu:main' }]
      ];
      return bot.sendMessage(
        chatId,
        t(user.language, 'your_coins') + user.coins.join(', '),
        { reply_markup: { inline_keyboard: keyboard } }
      );
    }

    if (query.data === 'monitor:set_interval') {
      const maxInterval = user.status === 'vip' ? 60000 : 600000;
      await bot.sendMessage(
        chatId,
        t(user.language, 'enter_interval').replace('{max}', maxInterval/1000)
      );
      return bot.once('message', setIntervalHandler(bot, chatId, maxInterval));
    }

    if (query.data === 'monitor:set_threshold') {
      const maxThreshold = user.status === 'vip' ? 5 : 10;
      await bot.sendMessage(
        chatId,
        t(user.language, 'enter_threshold').replace('{max}', maxThreshold)
      );
      return bot.once('message', setThresholdHandler(bot, chatId, maxThreshold));
    }

    if (query.data === 'monitor:edit') {
      user.coins = [];
      await user.save();
      await bot.sendMessage(chatId, t(user.language, 'enter_coins'));
      return bot.once('message', addCoinsHandler(bot, chatId));
    }

    /*if (query.data === 'menu:main') {
      return sendMainMenu(bot, chatId, user.language);
    }*/
  });
};

async function validateSymbols(symbols) {
  const valid = [];
  const invalid = [];
  for (const sym of symbols) {
    try {
      const prices = await client.prices({ symbol: sym });
      if (prices[sym]) valid.push(sym);
      else invalid.push(sym);
    } catch {
      invalid.push(sym);
    }
  }
  return { valid, invalid };
}

function addCoinsHandler(bot, chatId) {
  return async (msg) => {
    const user = await User.findOne({ telegramId: chatId });
    const input = msg.text.split(/\s*,\s*/).map(c => c.toUpperCase());
    const maxCoins = user.status === 'vip' ? 5 : 2;
    const { valid, invalid } = await validateSymbols(input);
    if (valid.length === 0) {
      await bot.sendMessage(chatId, t(user.language, 'no_valid_coins')); 
      return sendMainMenu(bot, chatId, user.language);
    }
    user.coins = valid.slice(0, maxCoins);
    await user.save();
    let response = t(user.language, 'monitoring_set') + user.coins.join(', ');
    if (invalid.length) {
      response += '\n' + t(user.language, 'invalid_coins') + invalid.join(', ');
    }
    await bot.sendMessage(chatId, response);
    return sendMainMenu(bot, chatId, user.language);
  };
}

function setIntervalHandler(bot, chatId, maxInterval) {
  return async (msg) => {
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
}

function setThresholdHandler(bot, chatId, maxThreshold) {
  return async (msg) => {
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
}