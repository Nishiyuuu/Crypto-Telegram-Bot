#!/usr/bin/env node

// Тест системи допомоги
const t = require('./src/translate.js');

console.log('🧪 Testing Help System...\n');

// Тестуємо всі мови
const languages = ['en', 'uk', 'ru', 'be'];
const keys = [
  'help_text',
  'faq_text', 
  'contact_info',
  'how_to_use_text',
  'features_text',
  'faq',
  'contact',
  'how_to_use',
  'features',
  'back_to_help',
  'back_to_menu'
];

for (const lang of languages) {
  console.log(`📝 Testing language: ${lang.toUpperCase()}`);
  
  for (const key of keys) {
    try {
      const text = t(lang, key);
      if (text && text !== key) {
        console.log(`  ✅ ${key}: ${text.substring(0, 30).replace(/\n/g, ' ')}...`);
      } else {
        console.log(`  ❌ ${key}: Missing or invalid translation`);
      }
    } catch (e) {
      console.log(`  ❌ ${key}: Error - ${e.message}`);
    }
  }
  console.log('');
}

console.log('✅ Help system test completed!');
