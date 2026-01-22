import { GLOBAL_TX_PROCESS, TxProcess } from "../constant";
import { Market } from "../types";

// Declare module augmentation to add cancel method to Trade class
declare module "./index" {
    interface Trade {
        make_trading_decision(): void;
    }
}

// Function to attach methods to Trade class (called from index.ts)
export function attachDecisionMethods(TradeClass: new (...args: any[]) => any) {
    TradeClass.prototype.make_trading_decision = async function (): Promise<void> {

        let remaining_time_ratio =
            (this.marketTime - this.remainingTime) / this.marketTime;

        let up_price_ratio = Math.abs(this.upBuyPrice - 0.5) / 0.5;

        if (this.prevUpBuyPrice[0] || this.prevUpBuyPrice[1]) {
            Market.None;
        }

        if (GLOBAL_TX_PROCESS.current === TxProcess.Working) {
            console.log("Trading is already in progress");
            return;
        };

        switch (globalThis.__CONFIG__.strategy) {
            case "trade_1":
                if (remaining_time_ratio > globalThis.__CONFIG__.trade_1.exit_time_ratio || up_price_ratio > globalThis.__CONFIG__.trade_1.exit_price_ratio) {
                    // selling holding token
                }

                switch (this.holdingStatus) {
                    case Market.Up:
                        if (remaining_time_ratio > 0.95 || up_price_ratio > 0.98) {
                            // selling holding token
                        }
                        break;
                    case Market.Down:
                        if (remaining_time_ratio > 0.95 || up_price_ratio > 0.98) {
                            // selling holding token
                        }
                        break;

                    default:
                        break;
                }
                break;

            case "trade_2":
                const exitRanges = globalThis.__CONFIG__.trade_2.exit_price_ratio_range;
                const inExitRange = exitRanges.some(([min, max]) => up_price_ratio >= min && up_price_ratio <= max);
                const [entry_price_ratio_min, entry_price_ratio_max] = globalThis.__CONFIG__.trade_2.entry_price_ratio;
                const entry_time_ratio = globalThis.__CONFIG__.trade_2.entry_time_ratio;
                const inEntryPriceRange = up_price_ratio >= entry_price_ratio_min && up_price_ratio <= entry_price_ratio_max;

                switch (this.holdingStatus) {
                    case Market.Up:
                        if (inExitRange) {
                            const sellSuccess = await this.sellUpToken();

                            // Only proceed with emergency buy if sell was successful
                            if (sellSuccess) {
                                // Check if in emergency swap price range to immediately buy opposite token
                                const emergencySwapPrice = globalThis.__CONFIG__.trade_2.emergency_swap_price;
                                if (emergencySwapPrice) {
                                    const [emergencyMin, emergencyMax] = emergencySwapPrice;
                                    const inEmergencySwapRange = up_price_ratio >= emergencyMin && up_price_ratio <= emergencyMax;
                                    if (inEmergencySwapRange) {
                                        console.log("🔄 Emergency swap: buying down token after successful sell");
                                        await this.buyDownToken();
                                    }
                                }
                            } else {
                                console.warn("⚠️  Sell failed, skipping emergency swap buy");
                            }
                        }
                        break;
                    case Market.Down:
                        if (inExitRange) {
                            const sellSuccess = await this.sellDownToken();

                            // Only proceed with emergency buy if sell was successful
                            if (sellSuccess) {
                                // Check if in emergency swap price range to immediately buy opposite token
                                const emergencySwapPrice = globalThis.__CONFIG__.trade_2.emergency_swap_price;
                                if (emergencySwapPrice) {
                                    const [emergencyMin, emergencyMax] = emergencySwapPrice;
                                    const inEmergencySwapRange = up_price_ratio >= emergencyMin && up_price_ratio <= emergencyMax;
                                    if (inEmergencySwapRange) {
                                        console.log("🔄 Emergency swap: buying up token after successful sell");
                                        await this.buyUpToken();
                                    }
                                }
                            } else {
                                console.warn("⚠️  Sell failed, skipping emergency swap buy");
                            }
                        }
                        break;

                    default:
                        // Only buy if we haven't bought yet
                        // Check if price ratio is within entry range and time ratio is met
                        if (!this.hasBought && remaining_time_ratio > entry_time_ratio && inEntryPriceRange) {
                            if (this.upBuyPrice > this.downBuyPrice) {
                                this.buyUpToken();
                            } else {
                                this.buyDownToken();
                            }
                        }
                        break;
                }



                break;
            default:
                break;
        }


    };
}