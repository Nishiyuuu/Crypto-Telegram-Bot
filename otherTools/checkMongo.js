const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://your-user:user1234@cluster0.scnwhzx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
