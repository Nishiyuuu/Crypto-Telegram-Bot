const { getPrice } = require('../src/services/binance');
const logger = require('../src/utils/logger');

const testBinanceService = async () => {
    logger.info('Testing Binance service...');

    console.log('\n--- Getting BTC price ---');
    const btcPrice = await getPrice('BTC');
    if (btcPrice) {
        console.log(`Current BTC Price: $${btcPrice}`);
    } else {
        console.log('Failed to get BTC price.');
    }

    console.log('\n--- Getting ETH price ---');
    const ethPrice = await getPrice('ETH');
    if (ethPrice) {
        console.log(`Current ETH Price: $${ethPrice}`);
    } else {
        console.log('Failed to get ETH price.');
    }

    console.log('\n--- Getting an invalid coin price (XYZ) ---');
    const xyzPrice = await getPrice('XYZ');
    if (xyzPrice) {
        console.log(`Current XYZ Price: $${xyzPrice}`);
    } else {
        console.log('Failed to get XYZ price as expected (coin not found).');
    }

    logger.info('Binance service test finished.');
};

testBinanceService();