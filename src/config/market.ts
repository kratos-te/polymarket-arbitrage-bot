import type { MarketConfig, Coin, Minutes } from "../types.js";
import { generateMarketSlug } from "./slug.js";

export const COINS: Record<Coin, string> = {
  btc: "Bitcoin",
  eth: "Ethereum",
  sol: "Solana",
  xrp: "XRP",
};

export const MINUTES_OPTIONS: Minutes[] = [15, 60, 240, 1440];

export function validateConfig(config: MarketConfig): boolean {
  if (!["btc", "eth", "sol", "xrp"].includes(config.coin)) {
    throw new Error(`Invalid coin: ${config.coin}. Must be one of: btc, eth, sol, xrp`);
  }
  if (![15, 60, 240, 1440].includes(config.minutes)) {
    throw new Error(`Invalid minutes: ${config.minutes}. Must be one of: 15, 60, 240, 1440`);
  }
  return true;
}

/**
 * Generate market slug for the given configuration
 */
export function getMarketSlug(config: MarketConfig): string {
  const { slug } = generateMarketSlug(config.coin, config.minutes);
  return slug;
}

/**
 * Get market query for API search (fallback method)
 */
export function getMarketQuery(config: MarketConfig): string {
  const coinSymbol = config.coin.toUpperCase();
  return coinSymbol;
}
