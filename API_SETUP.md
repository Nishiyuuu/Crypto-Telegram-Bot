# 🔑 API Configuration Guide

## 📊 Required APIs

### 1. **Telegram Bot API** (REQUIRED)
```bash
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```
**How to get:**
1. Message @BotFather on Telegram
2. Use `/newbot` command
3. Follow instructions to create bot
4. Copy the token

### 2. **MongoDB** (REQUIRED)
```bash
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/crypto_bot

# MongoDB Atlas (Cloud)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crypto_bot
```

## 🚀 Optional APIs (Recommended)

### 3. **CoinGecko API** (FREE)
```bash
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```
- **Free tier:** 50 calls/minute
- **No API key required**
- Used for: Price data, market info

### 4. **Binance API** (FREE)
```bash
BINANCE_API_KEY=your_binance_api_key
BINANCE_SECRET_KEY=your_binance_secret_key
```
**How to get:**
1. Create Binance account
2. Go to API Management
3. Create new API key
4. Enable "Enable Reading" permission only

### 5. **CryptoCompare API** (FREE TIER)
```bash
CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key
```
- **Free tier:** 100,000 calls/month
- Used for: Historical data, news

### 6. **CoinMarketCap API** (FREE TIER)
```bash
COINMARKETCAP_API_KEY=your_cmc_api_key
```
- **Free tier:** 10,000 calls/month
- Used for: Market cap rankings

## 💎 Premium APIs (Optional)

### 7. **TradingView API**
```bash
TRADINGVIEW_API_KEY=your_tradingview_key
```
- **Paid service**
- Used for: Advanced charting

### 8. **Messari API**
```bash
MESSARI_API_KEY=your_messari_key
```
- **Paid service**
- Used for: Fundamental analysis

## 🛡️ Security Best Practices

1. **Never commit .env file**
2. **Use read-only API keys when possible**
3. **Set IP restrictions on API keys**
4. **Monitor API usage regularly**
5. **Rotate keys periodically**

## 📈 API Rate Limits

| API | Free Tier | Paid Tier |
|-----|-----------|-----------|
| CoinGecko | 50/min | 500/min |
| Binance | 1200/min | 6000/min |
| CryptoCompare | 100k/month | 1M/month |
| CoinMarketCap | 10k/month | 1M/month |

## 🔧 Configuration Examples

### Minimal Setup (Free)
```env
BOT_TOKEN=your_bot_token
MONGO_URI=mongodb://localhost:27017/crypto_bot
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

### Professional Setup
```env
BOT_TOKEN=your_bot_token
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/crypto_bot
BINANCE_API_KEY=your_binance_key
BINANCE_SECRET_KEY=your_binance_secret
CRYPTOCOMPARE_API_KEY=your_cryptocompare_key
COINMARKETCAP_API_KEY=your_cmc_key
```

### Enterprise Setup
```env
BOT_TOKEN=your_bot_token
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/crypto_bot
BINANCE_API_KEY=your_binance_key
BINANCE_SECRET_KEY=your_binance_secret
TRADINGVIEW_API_KEY=your_tradingview_key
MESSARI_API_KEY=your_messari_key
WEBHOOK_URL=https://yourdomain.com/webhook
```
