const TelegramBot = require('node-telegram-bot-api');
const messages = require('./messages');
const {
  setUserLang,
  getUserLang,
  setUserCoin,
  getUserCoin,
  getAll
} = require('../db/userStore');
const { getPrice: getBinancePrice } = require('../services/binanceService');
const axios = require('axios');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const coins = ['BTC', 'ETH', 'XRP', 'SOL', 'DOGE'];

const { getPrice } = require('../services/binanceService');


// Клавіатура для вибору мови
function getLangKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        ['Українська 🇺🇦', 'Беларуская 🇧🇾'],
        ['Русский 🇷🇺', 'English 🇬🇧']
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    }
  };
}

// Головне меню
function getMainMenu(lang) {
  const labels = {
    uk: ['🪙 Вибрати монету', '💰 Ціна монети', '🌐 Мова', 'ℹ️ Допомога'],
    ru: ['🪙 Выбрать монету', '💰 Цена монеты', '🌐 Язык', 'ℹ️ Помощь'],
    en: ['🪙 Choose coin', '💰 Coin price', '🌐 Language', 'ℹ️ Help'],
    by: ['🪙 Выбраць манету', '💰 Цана манеты', '🌐 Мова', 'ℹ️ Дапамога'],
  };
  return {
    reply_markup: {
      keyboard: [
        [labels[lang][0], labels[lang][1]],
        [labels[lang][2], labels[lang][3]],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    }
  };
}

// --- /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, messages['en'].chooseLang, getLangKeyboard());
});

// --- Обробка повідомлень
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Вибір мови
  if (['Українська 🇺🇦', 'Беларуская 🇧🇾', 'Русский 🇷🇺', 'English 🇬🇧'].includes(text)) {
    let lang = 'en';
    if (text.includes('Українська')) lang = 'uk';
    else if (text.includes('Беларуская')) lang = 'by';
    else if (text.includes('Русский')) lang = 'ru';
    else if (text.includes('English')) lang = 'en';

    setUserLang(chatId, lang);
    return bot.sendMessage(chatId, messages[lang].description, getMainMenu(lang));
  }

  const lang = getUserLang(chatId);

  const labels = {
    chooseCoin: {
      uk: '🪙 Вибрати монету', ru: '🪙 Выбрать монету',
      en: '🪙 Choose coin', by: '🪙 Выбраць манету'
    },
    coinPrice: {
      uk: '💰 Ціна монети', ru: '💰 Цена монеты',
      en: '💰 Coin price', by: '💰 Цана манеты'
    },
    language: {
      uk: '🌐 Мова', ru: '🌐 Язык',
      en: '🌐 Language', by: '🌐 Мова'
    },
    help: {
      uk: 'ℹ️ Допомога', ru: 'ℹ️ Помощь',
      en: 'ℹ️ Help', by: 'ℹ️ Дапамога'
    }
  };

  // Обробка команд
  if (text === labels.chooseCoin[lang]) {
    const coinButtons = coins.map(c => [{ text: c }]);
    return bot.sendMessage(chatId, messages[lang].selectCoin, {
      reply_markup: {
        keyboard: coinButtons,
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
  }

  if (coins.includes(text)) {
    setUserCoin(chatId, text);
    return bot.sendMessage(chatId, messages[lang].coinAdded(text), getMainMenu(lang));
  }

  if (text === labels.coinPrice[lang]) {
    const coin = getUserCoin(chatId);
    if (!coin) return bot.sendMessage(chatId, messages[lang].selectCoin);

    const price = await getPrice(coin);
    if (!price) return bot.sendMessage(chatId, "Price info not available. Try later.");

    return bot.sendMessage(chatId, messages[lang].currentPrice(coin, price.toFixed(2)), getMainMenu(lang));
  }

  if (text === labels.language[lang]) {
    return bot.sendMessage(chatId, messages[lang].chooseLang, getLangKeyboard());
  }

  if (text === labels.help[lang]) {
    return bot.sendMessage(chatId, messages[lang].help, getMainMenu(lang));
  }

  return bot.sendMessage(chatId, messages[lang].description, getMainMenu(lang));
});

// 🔁 Запускаємо періодичний моніторинг Binance
const { startMonitoring } = require('../services/monitorService');
startMonitoring(bot);

console.log('Bot started');
