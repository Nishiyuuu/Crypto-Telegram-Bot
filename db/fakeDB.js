const users = {};

function addToWatchlist(userId, symbol) {
  if (!users[userId]) users[userId] = [];
  if (!users[userId].includes(symbol)) users[userId].push(symbol);
}

module.exports = { users, addToWatchlist };
