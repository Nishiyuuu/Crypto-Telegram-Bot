// db/userStore.js

const userData = {}; // userId: { lang: 'en', coin: 'BTC' }

function setUserLang(userId, lang) {
  if (!userData[userId]) userData[userId] = {};
  userData[userId].lang = lang;
}

function getUserLang(userId) {
  return userData[userId]?.lang || 'en';
}

function setUserCoin(userId, coin) {
  if (!userData[userId]) userData[userId] = {};
  userData[userId].coin = coin;
}

function getUserCoin(userId) {
  return userData[userId]?.coin || null;
}

// ⬇️ Додаємо функцію для отримання всіх користувачів з вибраною монетою
function getAll() {
  const result = {};
  for (const userId in userData) {
    const coin = userData[userId]?.coin;
    if (coin) {
      result[userId] = [coin]; // обгортаємо в масив, щоб бути сумісним з monitorService
    }
  }
  return result;
}

module.exports = {
  setUserLang,
  getUserLang,
  setUserCoin,
  getUserCoin,
  getAll, // 👈 обов’язково експортуємо
};
