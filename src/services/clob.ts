import { ApiKeyCreds, ClobClient, Side } from "@polymarket/clob-client";
import { Wallet } from "ethers";
import { POLYMARKET_PRIVATE_KEY, PROXY_WALLET_ADDRESS } from "../config";

export const HOST = "https://clob.polymarket.com";
export const CHAIN_ID = 137;
export const SIGNER = new Wallet(POLYMARKET_PRIVATE_KEY);

// For proxy wallets (Gnosis Safe), FUNDER must be the proxy contract address
// SIGNER is the EOA that signs, FUNDER is the proxy wallet that holds funds
export const FUNDER = PROXY_WALLET_ADDRESS;

export const SIGNATURE_TYPE = 2; // 2 = Gnosis Safe / Proxy wallet (0 = EOA, 1 = EIP-1271, 2 = Gnosis Safe)


export const getPrices = async (upTokenId: string, downTokenId: string) => {
    const response = await fetch("https://clob.polymarket.com/prices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify([
            {
                token_id: upTokenId,
                side: "BUY",
            },
            {
                token_id: upTokenId,
                side: "SELL",
            },
            {
                token_id: downTokenId,
                side: "BUY",
            },
            {
                token_id: downTokenId,
                side: "SELL",
            },
        ]),
    });
    const prices = await response.json();
    return prices;
}