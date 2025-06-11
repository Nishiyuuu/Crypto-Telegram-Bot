require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN_ID);

bot.start((ctx) => {
  console.log('Telegram ID користувача:', ctx.from.id);
  ctx.reply(`Привіт, твій Telegram ID: ${ctx.from.id}`);
});

bot.launch();
