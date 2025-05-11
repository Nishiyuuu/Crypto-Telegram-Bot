const axios = require('axios');

async function getCryptoPrice(coinId) {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price`;
    const res = await axios.get(url, {
      params: { ids: coinId, vs_currencies: 'usd' }
    });
    return res.data[coinId].usd;
  } catch (e) {
    console.error('⚠️ API Error:', e.message);
    return null;
  }
}

module.exports = { getCryptoPrice };
