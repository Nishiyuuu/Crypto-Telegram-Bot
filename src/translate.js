// Утиліта для перекладів
const translations = require('../translate.json');

function t(lang = 'en', key) {
  return translations[lang]?.[key] || translations['en'][key] || key;
}

module.exports = t;
