const validateCoins = (coinsString) => {
    if (!coinsString || typeof coinsString !== 'string') {
        return [];
    }
    return coinsString
        .split(',')
        .map(coin => coin.trim().toUpperCase())
        .filter(coin => coin.length > 0);
};

module.exports = validateCoins;