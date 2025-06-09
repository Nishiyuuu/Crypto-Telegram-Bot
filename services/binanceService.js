const Binance = require('binance-api-node').default;

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_SECRET_KEY,
});

const getPrice = async (symbol) => {
  try {
    const price = await client.prices({ symbol: symbol + 'USDT' });
    return parseFloat(price[symbol + 'USDT']); // 👈 конвертуємо у число
  } catch (error) {
    console.error('Binance API error:', error.message);
    return null;
  }
};


module.exports = { getPrice };
