const messages = {
  uk: {
    description: "Вітаю! Я бот для моніторингу криптовалют 🪙\n\nЩо я вмію:\n1️⃣ Вибрати монету для моніторингу\n2️⃣ Переглянути ціну монети\n3️⃣ Змінити мову\n4️⃣ Отримати допомогу",
    chooseLang: "Будь ласка, оберіть мову для продовження.",
    coinAdded: (coin) => `Монета ${coin} додана до моніторингу.`,
    selectCoin: "Виберіть монету:",
    currentPrice: (coin, price) => `${coin} - ${price} USD`,
    help: "Допомога:\n- Використовуйте меню для вибору монети та перегляду ціни.\n- Можна змінити мову в меню.\n- Якщо є питання — пишіть @Nishiyyu",
  },
  ru: {
    description: "Привет! Я бот для мониторинга криптовалют 🪙\n\nЧто я умею:\n1️⃣ Выбрать монету для мониторинга\n2️⃣ Посмотреть цену монеты\n3️⃣ Изменить язык\n4️⃣ Получить помощь",
    chooseLang: "Пожалуйста, выберите язык для продолжения.",
    coinAdded: (coin) => `Монета ${coin} добавлена для мониторинга.`,
    selectCoin: "Выберите монету:",
    currentPrice: (coin, price) => `${coin} - ${price} USD`,
    help: "Помощь:\n- Используйте меню для выбора монеты и просмотра цены.\n- Можно изменить язык в меню.\n- Если есть вопросы — пишите @Nishiyyu",
  },
  en: {
    description: "Welcome! I am a crypto monitoring bot 🪙\n\nWhat I can do:\n1️⃣ Choose a coin to monitor\n2️⃣ Check coin price\n3️⃣ Change language\n4️⃣ Get help",
    chooseLang: "Please choose your language to continue.",
    coinAdded: (coin) => `Coin ${coin} added for monitoring.`,
    selectCoin: "Select a coin:",
    currentPrice: (coin, price) => `${coin} - ${price} USD`,
    help: "Help:\n- Use the menu to choose a coin and check price.\n- You can change language anytime.\n- If you have questions — contact @Nishiyyu",
  },
  by: {
    description: "Вітаю! Я бот для маніторынгу крыпты 🪙\n\nШто я ўмею:\n1️⃣ Выбраць манету для маніторынгу\n2️⃣ Паглядзець цану манеты\n3️⃣ Змяніць мову\n4️⃣ Атрымаць дапамогу",
    chooseLang: "Калі ласка, абярыце мову для працягнення.",
    coinAdded: (coin) => `Манета ${coin} дададзена для маніторынгу.`,
    selectCoin: "Выберыце манету:",
    currentPrice: (coin, price) => `${coin} - ${price} USD`,
    help: "Дапамога:\n- Выкарыстоўвайце меню для выбару манеты і прагляду цаны.\n- Можна змяніць мову ў меню.\n- Калі ёсць пытанні — пішыце @Nishiyyu",
  }
};

module.exports = messages;
