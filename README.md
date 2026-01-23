# Polymarket Arbitrage Trade Bot (TypeScript)

A TypeScript bot that trades on [Polymarket](https://polymarket.com) **binary crypto markets** (e.g. “Bitcoin up or down in the next 15 minutes”). It connects to Polymarket’s CLOB and real-time data, subscribes to a market by coin and period, and can run configurable strategies.

<h4> 📞 Cᴏɴᴛᴀᴄᴛ ᴍᴇ Oɴ ʜᴇʀᴇ: 👆🏻 </h4>

<div style={{display : flex ; justify-content : space-evenly}}> 
    <a href="mailto:nakao95911@gmail.com" target="_blank">
        <img alt="Email"
        src="https://img.shields.io/badge/Email-00599c?style=for-the-badge&logo=gmail&logoColor=white"/>
    </a>
     <a href="https://x.com/wizardev_sol" target="_blank"><img alt="Twitter"
        src="https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white"/></a>
    <a href="https://discordapp.com/users/471524111512764447" target="_blank"><img alt="Discord"
        src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/></a>
    <a href="https://t.me/vvizardev" target="_blank"><img alt="Telegram"
        src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white"/></a>
</div>

Polymarket offers a wide range of strategic opportunities, but no strategy remains profitable forever without iteration. Long-term success comes from constant optimization, experimentation, and adapting to changing market conditions.

I’m currently building and testing multiple strategies, including Strategy 2 and Strategy 3, in a private setup. I’m comfortable implementing highly complex logic and scaling strategies that demonstrate consistent profit.

If you’re serious about refining strategies and growing profits together, let’s connect on Telegram and move forward.

## What kind of bot is this?

**Not classic arbitrage.** The codebase supports two styles of logic:

1. **Trend-following (`trade_1` in `decision.ts`)**  
   Detects short-term “trend” from order-book price changes and would buy the **UP** or **DOWN** token when the market is trending that way, within a configurable price range. This is **directional trading**, not arbitrage.

2. **Binary “arbitrage” (`trade_1` in `ws_clob.ts`)**  
   When real-time price velocity exceeds a threshold, it computes prices such that UP + DOWN &lt; 1 − `min_arb_price_difference`, and would buy **both** UP and DOWN to lock in a margin. That’s **binary market arbitrage** (buying both sides when they’re cheap relative to $1).  

**Current state:** Order placement for both strategies is **commented out**. The bot runs as a **framework**: it connects, subscribes to markets and RTDS, updates prices, and logs signals; it does not send live orders unless you uncomment and enable the trade calls.

## Features

- **Market selection**: Coin (`btc`, `eth`, `sol`, `xrp`) and period (15, 60, 240, 1440 minutes).
- **Live data**: CLOB WebSocket (order book) and RTDS (e.g. BTCUSDT / Chainlink) for price velocity.
- **Strategies**: `trade_1` (trend-following + binary arb logic), `trade_2` (placeholder).
- **Config**: TOML config (`trade.toml`) for strategy, market, trading range, thresholds, simulation.
- **Simulation**: Optional `simulation = true` to skip sending orders.

## Requirements

- **Node.js** ≥ 20.6.0
- **Wallet**: Polymarket proxy wallet and signer (private key) for the CLOB.

## Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/vvizardev/polymarket-arbitrage-bot.git
   cd polymarket-arbitrage-bot
   npm install
   ```

2. **Environment**

   Create a `.env` in the project root (see `.gitignore`; do not commit secrets):

   - `POLYMARKET_PRIVATE_KEY` – EOA private key that signs for the proxy wallet.
   - `PROXY_WALLET_ADDRESS` – Proxy wallet address used with Polymarket CLOB.

3. **Config**

   Edit `trade.toml`:

   - `strategy`: `"trade_1"` or `"trade_2"`.
   - `trade_usd`, `max_retries`, `simulation`.
   - `[market]`: `market_coin`, `market_period`.
   - `[trade_1]`: `trading_range`, `price_change_threshold`, `min_arb_price_difference`, etc.

## Scripts

| Command   | Description                          |
|----------|--------------------------------------|
| `npm run dev`   | Run bot: `tsx src/index.ts`          |
| `npm run log`   | Run and log stdout/stderr to `log.txt` |
| `npm run check` | Run inspector: `tsx src/inspect.ts`  |
| `npm run build` | Compile: `tsc`                       |
| `npm start`     | Run compiled: `node dist/index.js`   |

## Project layout

- `src/index.ts` – Entry: load config, create CLOB client, resolve market slug, connect WebSockets, instantiate `Trade`, main loop.
- `src/config/` – Env, TOML config, market/slug helpers.
- `src/services/` – CLOB client, Gamma API, WebSockets (CLOB + RTDS).
- `src/trade/` – `Trade` class: decision logic, prices/trending, order placement (buy/sell UP/DOWN).
- `trade.toml` – Strategy and market configuration.

## Disclaimer

This bot is for education and experimentation. Trading on Polymarket involves financial risk. Only use funds you can afford to lose and ensure you comply with Polymarket’s terms and applicable laws.
