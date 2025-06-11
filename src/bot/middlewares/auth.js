const { ADMIN_IDS } = require('../../config/env');

module.exports = async (context, next) => {
    if(!ctx.from) return;

    const userId = ctx.from.id;

    if(ADMIN_IDS.includes(userId)) {
        return next();
    }

    return ctx.reply('⛔️ Доступ тільки для адмінів');
}