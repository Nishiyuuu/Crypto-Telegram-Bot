const { User } = require('../../db/models/user');
const { languageKeyboard } = require('../keyboards/languageMenu');

module.exports = async(ctx) => {
    try {
        const userId = ctx.from.id;
        const userLanguage = ctx.from.language_code || 'en';

        let user = await user.findOne({ userId });
        if(!user){
            user = new user({
                userId,
                language: userLanguage,
                isVIP: false,
                createdAt: new Date(),
            });
            await user.save;
        }

        ctx.userLanguage = user.language;

        await ctx.reply(
            ctx.t('start_message'),
            {
                reply_markup: languageKeyboard,
            }
        );
    } catch (err) {
        console.error('❌ Error in start command:', err);
        await ctx.reply('😵 Щось пішло не так при старті. Спробуй ще раз.');
    }
};