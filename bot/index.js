const TelegramBot = require('node-telegram-bot-api');
const { getCryptoPrice } = require('../services/cryptoService');
const { coinMap } = require('../config/coinMap');
const db = require('../db/fakeDB');
const { monitorPrices } = require('../services/monitorService');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Команда старт
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '👋 Привіт! Введи /add BTC, щоб слідкувати за біткоїном.');
});

// Додати монету
bot.onText(/\/add (.+)/, (msg, match) => {
  const userId = msg.chat.id;
  const symbol = match[1].toUpperCase();

  if (!coinMap[symbol]) {
    return bot.sendMessage(userId, `🚫 Не знаю такої монети: ${symbol}`);
  }

  db.addToWatchlist(userId, symbol);
  bot.sendMessage(userId, `✅ Тепер слідкуємо за ${symbol}`);
});

// Тест команди /price
bot.onText(/\/price (.+)/, async (msg, match) => {
  const symbol = match[1].toUpperCase();
  const coinId = coinMap[symbol];
  if (!coinId) return bot.sendMessage(msg.chat.id, '🚫 Невідомий символ.');

  const price = await getCryptoPrice(coinId);
  bot.sendMessage(msg.chat.id, `💰 ${symbol} зараз $${price}`);
});

// Старт моніторингу
monitorPrices(bot);
