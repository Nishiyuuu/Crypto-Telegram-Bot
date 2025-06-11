const { Telegraf, Scenes, session } = require('telegraf');
const { BOT_TOKEN } = require('../config/env');

const start = require('./commands/start');
const price = require('./commands/price');
const monitor = require('./commands/monitor');
const help = require('./commands/help');
const settings = require('./commands/settings');
const subscribe = require('./commands/subscribe');
const admin = require('./commands/admin');

const monitoringWizard = require('./scenes/monitorWizard');
const stage = new Scenes.Stage([monitoringWizard]);

const auth = require('./middlewares/auth');
const i18n = require('./middlewares/i18n');

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.use(i18n);

bot.use(stage.middleware());

bot.command('start', start);
bot.command('price', price);
bot.command('monitor', monitor);
bot.command('settings', settings);
bot.command('subscribe', subscribe);
bot.command('admin', admin);
bot.command('help', help);

module.exports = bot;