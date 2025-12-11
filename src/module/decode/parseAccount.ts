import { PublicKey } from "@solana/web3.js";
import { decodeRouteArgs } from "./parseSwapIx";

const parseAccount = (ix1: any, ix2: any, data1: any, data2: any): {
    uniqueTokens: any
    refinedPlan: any
    remainingAccounts: any
    uniqueLUT: any
} => {

    const { swapInstruction: swapIx1, addressLookupTableAddresses: lut1 } = ix1;
    const { swapInstruction: swapIx2, addressLookupTableAddresses: lut2 } = ix2;

    const tokenAddresses = new Set();
    // Add the input and output mints from each swap
    data1.routePlan.forEach((item: any) => {
        tokenAddresses.add(item.swapInfo.inputMint);
        tokenAddresses.add(item.swapInfo.outputMint);
    });

    data2.routePlan.forEach((item: any) => {
        tokenAddresses.add(item.swapInfo.inputMint);
        tokenAddresses.add(item.swapInfo.outputMint);
    });

    const uniqueTokens: Array<any> = [];
    tokenAddresses.forEach(ele => uniqueTokens.push(ele))

    const decoded1 = decodeRouteArgs(Buffer.from(ix1.swapInstruction.data, 'base64'));
    const decoded2 = decodeRouteArgs(Buffer.from(ix2.swapInstruction.data, 'base64'));

    const combinedRoute = [...decoded1.route_plan, ...decoded2.route_plan];

    const refinedPlan = combinedRoute.map((ele, idx) => {
        return {
            swap: ele.swap,
            percent: 100,
            inputIndex: idx,
            outputIndex: idx === combinedRoute.length - 1 ? 0 : idx + 1,
        };
    });


    const remainingAccounts = [
        ...swapIx1.accounts.slice(9).map((ele: any) => ({
            ...ele,
            pubkey: new PublicKey(ele.pubkey),
        })),
        ...swapIx2.accounts.slice(9).map((ele: any) => ({
            ...ele,
            pubkey: new PublicKey(ele.pubkey),
        })),
    ];

    const uniqueLUT = [...new Set([...lut1, ...lut2])];

    return {
        uniqueTokens,
        refinedPlan,
        remainingAccounts,
        uniqueLUT,
    }
}

export {
    parseAccount
}