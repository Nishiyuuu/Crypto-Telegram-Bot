const { getCryptoPrice } = require('./cryptoService');
const db = require('../db/fakeDB');
const { coinMap } = require('../config/coinMap');

const lastPrices = {};

function monitorPrices(bot) {
  setInterval(async () => {
    for (const userId in db.users) {
      for (const symbol of db.users[userId]) {
        const coinId = coinMap[symbol];
        const price = await getCryptoPrice(coinId);

        if (!lastPrices[symbol]) {
          lastPrices[symbol] = price;
          continue;
        }

        const diff = ((price - lastPrices[symbol]) / lastPrices[symbol]) * 100;
        if (Math.abs(diff) >= 5) {
          bot.sendMessage(userId, `🚨 ${symbol} змінився на ${diff.toFixed(2)}%! Ціна: $${price}`);
          lastPrices[symbol] = price;
        }
      }
    }
  }, 60_000); // кожну хвилину
}

module.exports = { monitorPrices };
