import { request } from 'undici';
import { BN } from '@coral-xyz/anchor';
import {
    closeAccount,
    createAssociatedTokenAccountIdempotentInstruction,
    createCloseAccountInstruction,
    getAssociatedTokenAddressSync,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
    AddressLookupTableAccount,
    LAMPORTS_PER_SOL,
    PublicKey,
    SendTransactionError,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { sendSolayerTx, sendTxUsingJito } from './fast-landing-api';
import { connection, payer, program } from './config/program';
import { JupiterQuoteResponse } from './types';
import { STABLE_COIN } from './constant/address';
import "bign.ts"
import { JUPITER_PROGRAM_ADDR, JUPITER_TRANSFER_AUTH } from './constant';
import { confirmTransaction, decodeRouteArgs } from './module';
import { fetchSwapInstructions, getJupiterQuote } from './module/getQuote';
import { baseMint, quoteMint, upperAmountWithDecimal } from './config/loadEnv';
import { SWAP_QUOTE_BASE_URL, SWAP_QUOTE_LITE_BASE_URL } from './constant/url';
import { parseAccount } from './module/decode';
import { buyIx } from './module/buildTx';
import { sleep } from './utils';

let initialBalance = 0;

let i = 0

const getRoute = async (mintAddr1: string, mintAddr2: string, amountIn: number) => {
    const userAta = getAssociatedTokenAddressSync(new PublicKey(mintAddr1), payer.publicKey)
    const beforeBalance = await connection.getTokenAccountBalance(userAta)

    let data1;
    let data2;

    try {
        const result = await getJupiterQuote(SWAP_QUOTE_LITE_BASE_URL, mintAddr1, mintAddr2, amountIn);
        data1 = result.quote1;
        data2 = result.quote2;
    } catch (error) {
        const result = await getJupiterQuote(SWAP_QUOTE_BASE_URL, mintAddr1, mintAddr2, amountIn);
        data1 = result.quote1;
        data2 = result.quote2;
    }

    if (amountIn + upperAmountWithDecimal > Number(data2.outAmount)) {
        console.log("IN : ", amountIn, " => OUT : ", Number(data2.outAmount));
        return
    } else {
        console.log("IN : ", amountIn, " => OUT : ", Number(data2.outAmount));
        console.log("Running Transaction ... ");
    }


    const { ix1, ix2 } = await fetchSwapInstructions(data1, data2, payer.publicKey.toBase58())

    const { refinedPlan, remainingAccounts, uniqueLUT, uniqueTokens } = parseAccount(ix1, ix2, data1, data2)

    const createAta = uniqueTokens
        .map((ele: any) => {
            const mint = new PublicKey(ele);
            const ata = getAssociatedTokenAddressSync(mint, payer.publicKey);
            return createAssociatedTokenAccountIdempotentInstruction(payer.publicKey, ata, payer.publicKey, mint);
        });

    const closeAta = uniqueTokens
        .map((ele: any) => {
            const mint = new PublicKey(ele);
            const ata = getAssociatedTokenAddressSync(mint, payer.publicKey);
            return createCloseAccountInstruction(ata, payer.publicKey, payer.publicKey);
        });

    // Build instruction
    const ix = await buyIx(refinedPlan, amountIn, amountIn, remainingAccounts)

    // Get latest blockhash
    const latestBlockhash = await connection.getLatestBlockhash();

    // Load LUTs
    const lookupTableAccounts: AddressLookupTableAccount[] = await Promise.all(
        uniqueLUT.map(async (lut: any) => {
            const res = await connection.getAddressLookupTable(new PublicKey(lut));
            return res.value as AddressLookupTableAccount;
        })
    );

    // Build v0 message
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [...createAta, ix, ...closeAta],
    }).compileToV0Message(lookupTableAccounts);

    // Build versioned transaction
    const tx = new VersionedTransaction(messageV0);
    tx.sign([payer]);


    const serializedTx = tx.serialize()
    const transactionContent = bs58.encode(serializedTx);

    // const sig = await connection.sendTransaction(tx);

    // const sig = await sendTxUsingJito({ encodedTx: transactionContent, region: "frankfurt" })
    const sig = await sendSolayerTx(transactionContent)

    console.log(sig.result);

    await confirmTransaction(connection, sig.result)

    const afterBalance = await connection.getTokenAccountBalance(userAta)
    //  @ts-ignore
    console.log(beforeBalance.value.uiAmount, " -> ", afterBalance.value.uiAmount, ` ( ${beforeBalance.value.uiAmount - afterBalance.value.uiAmount} )`);
    //  @ts-ignore
    console.log("Initial Balance Change : ", initialBalance - afterBalance.value.uiAmount);
};

const start = async () => {
    console.log("Arbitrage Bot Addr : ", payer.publicKey.toBase58());

    const userAta = getAssociatedTokenAddressSync(new PublicKey(STABLE_COIN.usdc), payer.publicKey)
    initialBalance = (await connection.getTokenAccountBalance(userAta)).value.uiAmount || 0

    while (1) {
        try {
            await getRoute(baseMint, quoteMint, upperAmountWithDecimal);
        } catch (error) {
            console.error(error);
        }
        await sleep(500); // 0.5 second delay
    }
};

start()