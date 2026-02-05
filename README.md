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
- **Strategies**: `trade_1` (time/price exit), `trade_2` (entry/exit ranges + optional emergency swap).
- **Config**: TOML config (`trade.toml`) for strategy, market, trading range, thresholds, simulation.
- **Simulation**: Optional `simulation = true` to skip sending orders.

## Strategy logic (`decision.ts`)

### trade_1 — Time / price exit

- **Goal**: Hold a position (UP or DOWN) and exit when either time or price threshold is reached.
- **Exit**: If **remaining time ratio** (elapsed time / market duration) &gt; `trade_1.exit_time_ratio` **or** **up-price ratio** (distance of UP bid from 0.5) &gt; `trade_1.exit_price_ratio`, the bot sells the currently held token:
  - Holding **UP** → `sellUpToken()`
  - Holding **DOWN** → `sellDownToken()`
- **Config** (`[trade_1]` in `trade.toml`): `exit_time_ratio`, `exit_price_ratio`, plus `entry_price_range`, `swap_price_range`, `take_profit`, `stop_loss` for future entry/risk logic.

### trade_2 — Entry/exit ranges + emergency swap

- **Goal**: Enter when price and time are in range; exit when price is in an exit band; optionally flip to the opposite side in an “emergency” price band.
- **Entry** (when not holding): If `remaining_time_ratio` &gt; `trade_2.entry_time_ratio` and **up-price ratio** is inside `trade_2.entry_price_ratio` `[min, max]`, buy the cheaper side (UP if `upBuyPrice` &gt; `downBuyPrice`, else DOWN).
- **Exit**: If up-price ratio falls inside any of the `trade_2.exit_price_ratio_range` intervals:
  - Holding **UP** → `sellUpToken()`; if sell succeeds and up-price ratio is in `trade_2.emergency_swap_price`, then `buyDownToken()`.
  - Holding **DOWN** → `sellDownToken()`; if sell succeeds and up-price ratio is in `trade_2.emergency_swap_price`, then `buyUpToken()`.
- **Config** (`[trade_2]`): `entry_price_ratio`, `entry_time_ratio`, `exit_price_ratio_range`, `emergency_swap_price` (optional).

### trade_3 — Arbitrage Strategy ( Private )

<img width="633" height="778" alt="image" src="https://github.com/user-attachments/assets/e505340a-ca97-4b95-86a4-845280012ae5" />

<img width="820" height="440" alt="image" src="https://github.com/user-attachments/assets/43d5fd12-31a7-456b-b233-599009ff64bf" />

<img width="396" height="183" alt="image" src="https://github.com/user-attachments/assets/eff9a02f-a7b7-4e65-8a8d-dd35c5009d23" />
<img width="397" height="185" alt="image" src="https://github.com/user-attachments/assets/7338ec54-9ceb-4e73-ab64-9dedc89c02e6" />
<img width="393" height="179" alt="image" src="https://github.com/user-attachments/assets/2e5be4f5-9989-4714-94f4-c3a22c49ab7e" />
<img width="390" height="181" alt="image" src="https://github.com/user-attachments/assets/e8fd5104-b1da-4c71-9fca-54d19a904b02" />
<img width="388" height="176" alt="image" src="https://github.com/user-attachments/assets/280a3981-579b-46be-b863-5a9d318250d9" />
<img width="389" height="175" alt="image" src="https://github.com/user-attachments/assets/bc55db1f-c9d2-4b47-a6ce-3be5d6149972" />
<img width="392" height="176" alt="image" src="https://github.com/user-attachments/assets/787b27f7-8502-464c-86e8-133397a4eaca" />



## Requirements

- **Node.js** ≥ 20.6.0
- **Wallet**: Polymarket proxy wallet and signer (private key) for the CLOB.

## Setup

1. **Clone and install**

   Ubuntu
   ```bash
   curl -L -o polymarket-arbitrage-bot.zip https://github.com/vvizardev/polymarket-arbitrage-bot/archive/refs/tags/polymarket-arbitrage-bot.zip
   unzip polymarket-arbitrage-bot.zip
   cd polymarket-arbitrage-bot
   npm install
   ```

   Windows
   ```powershell
   Invoke-WebRequest -Uri "https://github.com/vvizardev/polymarket-arbitrage-bot/archive/refs/tags/polymarket-arbitrage-bot.zip" -OutFile "polymarket-arbitrage-bot.zip"
   Expand-Archive -Path ".\polymarket-arbitrage-bot.zip" -DestinationPath "."
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
