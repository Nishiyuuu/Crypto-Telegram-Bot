require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

async function checkConnection() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Підключення до MongoDB успішне!");
  } catch (e) {
    console.error("❌ Помилка підключення:", e);
  } finally {
    await client.close();
  }
}

checkConnection();
