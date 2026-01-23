import { ClobClient, Side } from "@polymarket/clob-client";
import { generateMarketSlug } from "./config";
import type { Coin, MarketConfig, Minutes } from "./types";
import { CHAIN_ID, FUNDER, getEvent, getMarket, getPrices, HOST, SIGNATURE_TYPE, SIGNER } from "./services";
import { getCurrentTime } from "./utils";
import { loadConfig } from "./config/toml";
import { Trade } from "./trade";

loadConfig();

const marketConfig: MarketConfig = {
  coin: globalThis.__CONFIG__.market.market_coin as Coin, // btc / eth / sol / xrp
  minutes: parseInt(globalThis.__CONFIG__.market.market_period) as Minutes, // 15 / 60 / 240 / 1440
};

async function main() {

  console.log("SIGNER ", SIGNER);

  const clobClient = new ClobClient(
    HOST,
    CHAIN_ID,
    SIGNER,
  );

  const apiKey = await clobClient.createOrDeriveApiKey();

  console.log("apiKey", apiKey);


  while (true) {
    const client = new ClobClient(
      HOST,
      CHAIN_ID,
      SIGNER,
      apiKey, // Generated from L1 auth, API credentials enable L2 methods
      SIGNATURE_TYPE, // 2 for Gnosis Safe / Proxy wallet
      FUNDER // Proxy wallet contract address (holds funds), SIGNER is the EOA that signs
    );
    const { slug, endTimestamp } = generateMarketSlug(marketConfig.coin, marketConfig.minutes);

    console.log(`🔍 Searching for market with slug: "${slug}"`);
    console.log(`   Market ends at:${getCurrentTime()} / ${endTimestamp}`);

    const market = await getMarket(slug);

    const upTokenId = JSON.parse(market.clobTokenIds)[0];
    const downTokenId = JSON.parse(market.clobTokenIds)[1];
    const usd = globalThis.__CONFIG__.trade_usd;

    const trade = new Trade
      (
        usd,
        upTokenId,
        downTokenId,
        client
      );

    while (true) {

      getPrices(upTokenId, downTokenId)
        .then(async e => {

          trade.updatePrices(endTimestamp - getCurrentTime(), e[upTokenId].BUY, e[upTokenId].SELL, e[downTokenId].BUY, e[downTokenId].SELL);
          await trade.make_trading_decision();
        })
        .catch(e => console.error(e));

      await new Promise(resolve => setTimeout(resolve, 1000));


      if (endTimestamp - getCurrentTime() <= 0) {
        break;
      }
    }
  }

}

main();
