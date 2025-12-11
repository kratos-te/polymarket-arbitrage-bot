import { fetch, request , ProxyAgent} from 'undici';
import type { JupiterQuoteResponse } from '../types';
import { SLIPPAGE_BPS, SWAP_QUOTE_BASE_URL } from '../constant/url';

const client = new ProxyAgent(
	'http://QjwGqCqQl2UWEr9W:jiLp2z19ehEcgrC5_streaming-1@geo.iproyal.com:12321'
);

const getJupiterQuote = async (
    qouoteUrl : string,
    baseCoin: string,
    quoteCoin: string,
    amountIn: number
): Promise<{ quote1: JupiterQuoteResponse; quote2: JupiterQuoteResponse }> => {
    const quote1Url = `${qouoteUrl}?inputMint=${baseCoin}&outputMint=${quoteCoin}&amount=${amountIn}&slippageBps=${SLIPPAGE_BPS}`;

    const res1 = await fetch(quote1Url);
    // const res1 = await fetch(quote1Url, {
    //     dispatcher: client,
    // });
    if (!res1.ok) throw new Error(`quote1 fetch failed: ${res1.status}`);
    const quote1 = (await res1.json()) as JupiterQuoteResponse;

    const quote2Url = `${qouoteUrl}?inputMint=${quoteCoin}&outputMint=${baseCoin}&amount=${quote1.outAmount}&slippageBps=${SLIPPAGE_BPS}`;

    const res2 = await fetch(quote2Url);
    // const res2 = await fetch(quote2Url, {
    //     dispatcher: client,
    // });
    if (!res2.ok) throw new Error(`quote2 fetch failed: ${res2.status}`);
    const quote2 = (await res2.json()) as JupiterQuoteResponse;



    const route = [...quote1.routePlan.map(ele => ele.swapInfo.label),
    ...quote2.routePlan.map(ele => ele.swapInfo.label)]

    console.log(route.join(" -> "));

    return { quote1, quote2 };
};

const fetchSwapInstructions = async (data1: JupiterQuoteResponse, data2: JupiterQuoteResponse, userPublicKey: string): Promise<{ ix1: any; ix2: any }> => {

    const body1 = JSON.stringify({
        quoteResponse: data1,
        wrapAndUnwrapSol: false,
        useSharedAccounts: false,
        userPublicKey,
    });

    const body2 = JSON.stringify({
        quoteResponse: data2,
        wrapAndUnwrapSol: false,
        useSharedAccounts: false,
        userPublicKey,
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const [res1, res2] = await Promise.all([
        request('https://quote-api.jup.ag/v6/swap-instructions', {
            method: 'POST',
            headers,
            body: body1,
        }),
        request('https://quote-api.jup.ag/v6/swap-instructions', {
            method: 'POST',
            headers,
            body: body2,
        }),
    ]);

    const [ix1, ix2] = await Promise.all([res1.body.json(), res2.body.json()]);

    return { ix1, ix2 }; // Return the results as an object

};


export {
    getJupiterQuote,
    fetchSwapInstructions
}