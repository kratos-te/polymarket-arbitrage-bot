import { ApiKeyCreds, ClobClient, Side } from "@polymarket/clob-client";
import { Wallet } from "ethers";
import { API_KEY, PASSPHASE, POLYMARKET_PRIVATE_KEY, SECRET_KEY } from "../config";

export enum TxProcess { Working, Idle }
export const GLOBAL_TX_PROCESS = { current: TxProcess.Idle };


export const MARKET_CHANNEL = "market";
export const USER_CHANNEL = "user";
