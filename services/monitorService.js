const { getPrice } = require('./binanceService');
const userStore = require('../db/userStore');

const monitorPrices = async (bot) => {
  const allUsers = userStore.getAll();

  for (const [chatId, symbols] of Object.entries(allUsers)) {
    for (const symbol of symbols) {
      const price = await getPrice(symbol);
      if (price) {
        bot.sendMessage(chatId, `🔔 Update for ${symbol}: $${price}`);
      }
    }
  }
};

const startMonitoring = (bot) => {
  monitorPrices(bot);
  setInterval(() => monitorPrices(bot), 120000); // Кожні 2 хвилини
};

module.exports = { startMonitoring };
