import { ClobClient, Side } from "@polymarket/clob-client";
import { Market } from "../types";

export class Trade {
    usd!: number;
    share!: number;
    holdingStatus!: Market;
    upBuyPrice!: number;
    downBuyPrice!: number;
    upSellPrice!: number;
    downSellPrice!: number;

    prevUpBuyPrice!: [number, number];
    prevDownBuyPrice!: [number, number];

    prevUpTokenBalance!: number;
    prevDownTokenBalance!: number;

    hasBought!: boolean; // Track if we've already made a buy order
    quitMarket!: boolean;
    marketTime!: number;
    remainingTime!: number;

    id!: string;
    amount!: number;
    status!: string;
    upTokenId: string;
    downTokenId: string;

    authorizedClob: ClobClient

    constructor(
        usd: number,
        upTokenId: string,
        downTokenId: string,
        authorizedClob: ClobClient
    ) {
        this.usd = usd;
        this.upTokenId = upTokenId;
        this.downTokenId = downTokenId;

        this.share = 0;
        this.holdingStatus = Market.None;
        this.upBuyPrice = 0;
        this.downBuyPrice = 0;
        this.upSellPrice = 0;
        this.downSellPrice = 0;
        this.prevUpBuyPrice = [0, 0];
        this.prevDownBuyPrice = [0, 0];
        this.prevUpTokenBalance = 0;
        this.prevDownTokenBalance = 0;
        this.hasBought = false;
        this.quitMarket = false;
        this.marketTime = parseInt(globalThis.__CONFIG__.market.market_period) * 60;
        this.remainingTime = this.marketTime;

        this.authorizedClob = authorizedClob;
    }
}

// Import modules that extend Trade prototype (after class definition)
import { attachDecisionMethods } from "./decision";
import { attachPricesMethods } from "./prices";
import { attachTradeMethods } from "./trade";

attachDecisionMethods(Trade);
attachPricesMethods(Trade);
attachTradeMethods(Trade);