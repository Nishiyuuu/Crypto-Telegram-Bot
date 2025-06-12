const connectDB = require('./src/db/connect');
const bot = require('./src/bot/bot');
const logger = require('./src/utils/logger');

const startBot = async () => {
    try {
        await connectDB(); // Підключаємося до MongoDB
        await bot.launch(); // Запускаємо бота
        logger.info('🚀 Bot launched successfully!');

        // Обробка зупинки процесу
        process.once('SIGINT', () => {
            bot.stop('SIGINT');
            logger.info('Bot stopped by SIGINT');
        });
        process.once('SIGTERM', () => {
            bot.stop('SIGTERM');
            logger.info('Bot stopped by SIGTERM');
        });

    } catch (error) {
        logger.error('❌ Failed to launch bot:', error);
        process.exit(1);
    }
};

startBot();