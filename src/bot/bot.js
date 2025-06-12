const { Telegraf, session, Scenes } = require('telegraf');
const { BOT_TOKEN } = require('../config/env');
const logger = require('../utils/logger');
const User = require('../db/models/user');
const { handlePriceCommand } = require('./commands/price');

// --- Text translations (hardcoded for now, will be from language.json) ---
const texts = {
    "start_message": {
        "en": "Hello! I’m a crypto monitoring bot.",
        "ua": "Привіт! Я бот для моніторингу криптовалют.",
        "ru": "Привет! Я бот для мониторинга криптовалют."
    },
    "select_language": {
        "en": "Please select a language:",
        "ua": "Будь ласка, виберіть мову:",
        "ru": "Пожалуйста, выберите язык:"
    },
    "language_selected_notification": {
        "en": "Language set to English",
        "ua": "Мову встановлено на українську",
        "ru": "Язык установлен на русский"
    },
    "menu_main": {
        "en": "📋 Main Menu",
        "ua": "📋 Головне Меню",
        "ru": "📋 Главное Меню"
    },
    "menu_buttons": {
        "price": {
            "en": "💰 Price",
            "ua": "💰 Ціна",
            "ru": "💰 Цена"
        },
        "settings": {
            "en": "⚙️ Setting",
            "ua": "⚙️ Налаштування",
            "ru": "⚙️ Настройки"
        },
        "help": {
            "en": "❓ Help",
            "ua": "❓ Допомога",
            "ru": "❓ Помощь"
        }
    },
    "price_enter_symbol": {
        "en": "Please enter the coin symbol (e.g., BTC):",
        "ua": "Будь ласка, введіть символ монети (наприклад, BTC):",
        "ru": "Пожалуйста, введите символ монеты (например, BTC):"
        // Додайте "by" якщо ви підтримуєте білоруську
    },
    "price_response": { // <--- ПЕРЕВІРТЕ ЦЕЙ КЛЮЧ
        "en": "Price of {symbol}: {price}",
        "ua": "Ціна {symbol}: {price}",
        "ru": "Цена {symbol}: {price}"
        // Додайте "by" якщо ви підтримуєте білоруську
    },
    "price_not_found": {
        "en": "Could not find price for {symbol}. Please check the symbol.",
        "ua": "Не вдалося знайти ціну для {symbol}. Будь ласка, перевірте символ.",
        "ru": "Не удалось найти цену для {symbol}. Пожалуйста, проверьте символ."
        // Додайте "by" якщо ви підтримуєте білоруську
    },
    "general_error": { // Додамо загальний текст для помилок
        "en": "An unexpected error occurred. Please try again later.",
        "ua": "Виникла неочікувана помилка. Будь ласка, спробуйте пізніше.",
        "ru": "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже."
    },
    "invalid_input": { // Додамо текст для невірного вводу
        "en": "Invalid input. Please enter a valid coin symbol.",
        "ua": "Невірний ввід. Будь ласка, введіть дійсний символ монети.",
        "ru": "Неверный ввод. Пожалуйста, введите действительный символ монеты."
    }
};

// Створюємо екземпляр бота
const bot = new Telegraf(BOT_TOKEN);

// --- Middlewares ---
// 1. Session middleware (повинен бути першим)
bot.use(session());

// 2. Custom i18n middleware - ВАЖЛИВІ ЗМІНИ ТУТ!
bot.use(async (ctx, next) => {
    ctx.session = ctx.session || {}; 

    // Ініціалізуємо ctx.session.language, якщо вона ще не встановлена
    if (!ctx.session.language && ctx.from && ctx.from.id) {
        const user = await User.findOne({ userId: ctx.from.id });
        if (user && user.language) {
            ctx.session.language = user.language;
        } else {
            ctx.session.language = 'en'; // Дефолт для нових користувачів
        }
    } else if (!ctx.session.language) { // Fallback, якщо немає ctx.from.id
        ctx.session.language = 'en';
    }
    
    // Визначаємо ctx.i18n так, щоб він ДИНАМІЧНО читав ctx.session.language
    ctx.i18n = (key, replacements = {}) => {
        const dynamicLang = ctx.session.language || 'en'; // ЗАВЖДИ ЧИТАЄМО ЗНАЧЕННЯ З СЕСІЇ ПРИ ВИКЛИКУ

        let text = texts[key]?.[dynamicLang] || texts[key]?.['en'];

        if (text === undefined) {
            logger.warn(`Missing translation for key: "${key}" in lang: "${dynamicLang}". Falling back to "en".`);
            text = `TEXT_NOT_FOUND: ${key}`; 
        }
        
        for (const [k, v] of Object.entries(replacements)) {
            text = text.replace(`{${k}}`, v);
        }
        return text;
    };
    return next();
});


// --- Keyboards (меню) ---
const getMainMenu = (langCode) => {
    const currentLangCode = langCode || 'en'; 
    const priceText = texts.menu_buttons.price?.[currentLangCode] || texts.menu_buttons.price?.['en'];
    const settingsText = texts.menu_buttons.settings?.[currentLangCode] || texts.menu_buttons.settings?.['en'];
    const helpText = texts.menu_buttons.help?.[currentLangCode] || texts.menu_buttons.help?.['en'];

    return {
        reply_markup: {
            keyboard: [
                [{ text: priceText }, { text: settingsText }],
                [{ text: helpText }]
            ],
            resize_keyboard: true
        }
    };
};

const getLanguageMenu = () => {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🇬🇧 EN', callback_data: 'lang_en' }],
                [{ text: '🇺🇦 UA', callback_data: 'lang_ua' }],
                [{ text: '🇷🇺 RU', callback_data: 'lang_ru' }],
                [{ text: '🇧🇾 BY', callback_data: 'lang_by' }]
            ]
        }
    };
};


// --- Команди ---
// Обробник команди /start
bot.start(async (ctx) => {
    logger.info(`Received /start command from user ${ctx.from.id}`);
    const userId = ctx.from.id;

    let user = await User.findOne({ userId });

    if (!user) {
        // Новий користувач:
        user = new User({ userId }); 
        await user.save();
        logger.info(`New user ${userId} registered.`);

        // 1. Надсилаємо перше привітання (без клавіатури)
        await ctx.reply(ctx.i18n('start_message')); // Це буде Hello! I'm a crypto monitoring bot.
        
        // 2. Надсилаємо запит на вибір мови З inline-клавіатурою
        await ctx.reply(ctx.i18n('select_language'), getLanguageMenu()); // Це буде Please select a language:
    } else {
        // Існуючий користувач:
        logger.info(`Existing user ${userId} started bot.`);
        // Забезпечуємо, що сесія оновлена перед використанням i18n
        ctx.session.language = user.language; 

        await ctx.reply(ctx.i18n('start_message')); 
        await ctx.reply(ctx.i18n('menu_main'), getMainMenu(user.language));
    }
});

// Обробник вибору мови через inline кнопку - ВАЖЛИВІ ЗМІНИ ТУТ!
bot.action(/^lang_([a-z]{2})$/, async (ctx) => {
    const langCode = ctx.match[1];
    const userId = ctx.from.id;

    try {
        const user = await User.findOneAndUpdate(
            { userId },
            { language: langCode },
            { new: true, upsert: true }
        );

        ctx.session.language = langCode; // Оновлюємо мову в сесії негайно

        logger.info(`User ${userId} set language to ${langCode}`);

        // --- Видаляємо повідомлення, яке містило запит на вибір мови та inline-клавіатуру ---
        // Це усуне проблему дублювання "Hello!"
        if (ctx.callbackQuery && ctx.callbackQuery.message) {
            try {
                const messageToDeleteId = ctx.callbackQuery.message.message_id;
                await ctx.telegram.deleteMessage(ctx.chat.id, messageToDeleteId);
                logger.info(`Deleted language selection message for user ${userId}.`);
            } catch (deleteError) {
                // Логуємо помилку, але не падаємо, якщо не вдалося видалити
                logger.error(`Error deleting language selection message for user ${userId}:`, deleteError.message);
            }
        }
        
        // --- Відправляємо нове повідомлення з головним меню ---
        // Цей виклик ctx.i18n('menu_main') тепер використає актуальну мову з ctx.session.language
        await ctx.reply(
            ctx.i18n('menu_main'),
            getMainMenu(langCode)
        );

        // --- Відповідаємо на callback query ---
        try {
            await ctx.answerCbQuery(ctx.i18n('language_selected_notification', { lang: langCode })); 
        } catch (answerError) {
            logger.warn(`Could not answer callback query for user ${userId}:`, answerError.message);
        }

    } catch (error) {
        logger.error(`Unhandled error in language action for user ${userId}:`, error);
        await ctx.reply('An error occurred while setting your language. Please try again.');
    }
});

bot.command('price', handlePriceCommand); // <--- ЦЕЙ РЯДОК!

// Обробник для кнопки "💰 Ціна" у головному меню
// Цей обробник перехоплює натискання на кнопку з текстом "💰 Ціна" (в будь-якій мові)
bot.hears((text, ctx) => {
    const priceButtonTexts = Object.values(texts.menu_buttons.price);
    const userText = text.trim(); 
    return priceButtonTexts.some(btnText => btnText.trim() === userText);
}, async (ctx) => { 
    ctx.session.awaitingCoinSymbol = true; 
    await ctx.reply(ctx.i18n('price_enter_symbol')); 
    logger.info(`User ${ctx.from.id} is now awaiting coin symbol input.`);
});

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    // Перевіряємо, чи бот очікує введення символу монети від цього користувача
    if (ctx.session.awaitingCoinSymbol) {
        const symbol = ctx.message.text.trim().toUpperCase();
        
        // Додамо просту валідацію: чи складається символ тільки з літер
        if (!/^[A-Z]+$/.test(symbol)) {
            await ctx.reply(ctx.i18n('invalid_input'));
            // Ми не скидаємо стан awaitingCoinSymbol тут, щоб користувач міг ввести символ знову.
            return;
        }

        // Скидаємо стан очікування, оскільки символ отримано
        ctx.session.awaitingCoinSymbol = false; 
        logger.info(`User ${userId} entered symbol: ${symbol}. Awaiting state cleared.`);

        // ВИКЛИКАЄМО handlePriceCommand, ПЕРЕДАЮЧИ ctx І СИМВОЛ ОКРЕМО
        await handlePriceCommand(ctx, symbol); // <--- ВАЖЛИВА ЗМІНА ТУТ!

    } else {
        // Якщо це просто будь-яке інше текстове повідомлення, яке не є командою
        // і бот нічого не очікує, можна просто відповісти або проігнорувати.
        // За замовчуванням Telegraf просто ігнорує, що є ОК.
        // Якщо ви хочете обробити невідомі команди, це місце для цього:
        // await ctx.reply(ctx.i18n('unknown_command')); 
    }
});

module.exports = bot;