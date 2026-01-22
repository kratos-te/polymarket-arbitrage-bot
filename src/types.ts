export type Coin = "btc" | "eth" | "sol" | "xrp";
export type Minutes = 15 | 60 | 240 | 1440;

export interface MarketConfig {
  coin: Coin;
  minutes: Minutes;
}

export enum Market {
  Up = "Up",
  Down = "Down",
  None = "None",
}
