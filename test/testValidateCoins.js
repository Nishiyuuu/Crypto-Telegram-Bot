const validateCoins = require('../src/utils/validateCoins');

console.log('Validating "btc, eth, doge":', validateCoins('btc, eth, doge'));
console.log('Validating "XRP , LTC, ":', validateCoins('XRP , LTC, '));
console.log('Validating " invalid  coin ":', validateCoins(' invalid  coin '));
console.log('Validating empty string:', validateCoins(''));
console.log('Validating null:', validateCoins(null));
console.log('Validating undefined:', validateCoins(undefined));