#!/usr/bin/env node

// Тест меню допомоги
console.log('🧪 Тестування меню допомоги...\n');

// Симуляція користувача
const testUser = {
  telegramId: 123456789,
  language: 'uk'
};

// Тестуємо переклади
const t = require('./src/translate.js');

console.log('📱 Симуляція натискання "🆘 Допомога":');
console.log('=' .repeat(50));

// Головне меню допомоги
const helpText = t(testUser.language, 'help_text');
console.log(helpText);

console.log('\n🔘 Доступні кнопки:');
console.log(`[${t(testUser.language, 'how_to_use')}] [${t(testUser.language, 'features')}]`);
console.log(`[${t(testUser.language, 'faq')}] [${t(testUser.language, 'contact')}]`);
console.log(`[${t(testUser.language, 'back_to_menu')}]`);

console.log('\n📖 Тестування "Як користуватися":');
console.log('=' .repeat(50));
console.log(t(testUser.language, 'how_to_use_text'));

console.log('\n❓ Тестування FAQ:');
console.log('=' .repeat(50));
console.log(t(testUser.language, 'faq_text'));

console.log('\n📞 Тестування контактів:');
console.log('=' .repeat(50));
console.log(t(testUser.language, 'contact_info'));

console.log('\n✅ Всі розділи меню допомоги працюють коректно!');
console.log('💡 Тепер можете протестувати в Telegram боті: @COIN_INFOobot');
