type JupiterQuoteResponse = {
    inputMint: string;
    inAmount: string;
    outputMint: string;
    outAmount: string;
    otherAmountThreshold: string;
    swapMode: 'ExactIn' | 'ExactOut';
    slippageBps: number;
    platformFee: null | {
        amount: string;
        feeBps: number;
    };
    priceImpactPct: string;
    routePlan: {
        swapInfo: Record<string, any>; // You can define this more specifically if needed
        percent: number;
    }[];
    scoreReport: null | Record<string, any>;
    contextSlot: number;
    timeTaken: number;
    swapUsdValue: string;
    simplerRouteUsed: boolean;
    mostReliableAmmsQuoteReport: {
        info: Record<string, string>;
    };
};

export {
    JupiterQuoteResponse
}