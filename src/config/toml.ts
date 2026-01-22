import fs from "fs";
import TOML from "@iarna/toml";
import { z } from "zod";

const ConfigSchema = z.object({
  strategy: z.enum(["trade_1", "trade_2"]),
  trade_usd: z.number(),
  max_retries: z.number().default(3),
  market: z.object({
    market_coin: z.enum(["btc", "eth", "sol", "xrp"]),
    market_period: z.enum(["15", "60", "240", "1440"]),
  }),
  trade_1: z.object({
    entry_price_range: z.tuple([z.number(), z.number()]),
    swap_price_range: z.tuple([z.number(), z.number()]),
    take_profit: z.number(),
    stop_loss: z.number(),
    exit_time_ratio: z.number(),
    exit_price_ratio: z.number(),
  }),
  trade_2: z.object({
    entry_price_ratio: z.tuple([z.number(), z.number()]),
    entry_time_ratio: z.number(),
    exit_price_ratio_range: z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]),
    emergency_swap_price: z.tuple([z.number(), z.number()]).optional(),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

declare global {
  // makes config globally accessible
  var __CONFIG__: Config;
}

export function loadConfig(path = "trade.toml"): Config {
  if (!globalThis.__CONFIG__) {
    const raw = TOML.parse(fs.readFileSync(path, "utf-8"));
    globalThis.__CONFIG__ = ConfigSchema.parse(raw);
  }
  return globalThis.__CONFIG__;
}