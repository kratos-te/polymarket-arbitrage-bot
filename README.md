# Polymarket Trading Bot

A TypeScript trading bot for Polymarket cryptocurrency prediction markets.

## Features

- 🔍 Market discovery based on coin (BTC, ETH, SOL, XRP) and timeframes (15min, 1hr, 4hr, 24hr)
- 📊 Real-time order book and price data
- 🎯 Market filtering and selection
- 📈 Trading infrastructure (ready for strategy implementation)

---

### Contact to Developer

For support and further inquiries, please connect via Telegram: 📞 [vvizardev](https://t.me/vvizardev)

## Configuration

Edit `src/index.ts` to configure your market:

```typescript
const marketConfig: MarketConfig = {
  coin: "btc", // btc / eth / sol / xrp
  minutes: 60, // 15 / 60 / 240 / 1440
};
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your POLYMARKET_PRIVATE_KEY if you want to trade
```

3. Run the bot:
```bash
npm run dev
```

## Trading

The bot currently discovers and displays market information. To enable actual trading:

1. Add your private key to `.env` as `POLYMARKET_PRIVATE_KEY`
2. Implement your trading strategy in `src/trading-bot.ts`
3. The bot will use the Polymarket CLOB client to place orders

## Project Structure

- `src/index.ts` - Main entry point with configuration
- `src/trading-bot.ts` - Trading bot logic and market discovery
- `src/polymarket-client.ts` - Polymarket API client wrapper
- `src/types.ts` - TypeScript type definitions
- `src/config.ts` - Configuration utilities

## API Documentation

- [Polymarket Developer Docs](https://docs.polymarket.com/)
- [CLOB Client SDK](https://www.npmjs.com/package/@polymarket/clob-client)

## Disclaimer

This bot is for educational purposes. Always test thoroughly before using real funds. Trading involves risk.
