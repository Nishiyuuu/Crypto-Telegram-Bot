#!/usr/bin/env node

// Скрипт для очищення webhook та getUpdates конфліктів
require('dotenv').config();
const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не знайдено в .env файлі');
  process.exit(1);
}

console.log('🧹 Очищення Telegram webhook та reset getUpdates...');

// Функція для очищення webhook
function clearWebhook() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/deleteWebhook`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.ok) {
            console.log('✅ Webhook успішно очищено');
            resolve(result);
          } else {
            console.log('⚠️ Webhook очищення:', result.description);
            resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

// Функція для отримання bot info (також reset getUpdates)
function getBotInfo() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/getMe`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.ok) {
            console.log(`✅ Bot активний: @${result.result.username}`);
            resolve(result);
          } else {
            console.log('❌ Помилка отримання інформації про бота:', result.description);
            reject(new Error(result.description));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

// Головна функція
async function resetBot() {
  try {
    await clearWebhook();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Затримка 1 секунда
    await getBotInfo();
    console.log('🎉 Telegram API успішно очищено від конфліктів!');
    console.log('💡 Тепер можна безпечно запускати бота: npm run prod');
  } catch (error) {
    console.error('❌ Помилка під час очищення:', error.message);
    process.exit(1);
  }
}

resetBot();
