const translations = require('../translate.json');

/**
 * t - отримати фразу перекладу
 * @param {string} lang - код мови
 * @param {string} key - ключ перекладу
 */
function t(lang = 'en', key) {
  return (translations[lang] && translations[lang][key])
    ? translations[lang][key]
    : translations['en'][key] || key;
}

module.exports = t;