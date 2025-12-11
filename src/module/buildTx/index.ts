import { BN } from "@coral-xyz/anchor";
import { program } from "../../config/program";

const buyIx = async (refinedPlan: any, amountIn: any, minAmountOut: any, remainingAccounts: any) => {
    // Build instruction
    const ix = await program.methods
        .route(refinedPlan, new BN(amountIn), new BN(minAmountOut), 0, 0)
        .accounts({
            //  @ts-ignore
            destinationMint: new PublicKey(mintAddr1),
            //  @ts-ignore
            platformFeeAccount: JUPITER_PROGRAM_ADDR,
            //  @ts-ignore
            program: JUPITER_PROGRAM_ADDR,
            //  @ts-ignore
            tokenProgram: TOKEN_PROGRAM_ID,
            //  @ts-ignore
            userDestinationTokenAccount: userAta,
            //  @ts-ignore
            userSourceTokenAccount: userAta,
            //  @ts-ignore
            destinationTokenAccount: userAta,
            //  @ts-ignore
            user_transfer_authority: JUPITER_TRANSFER_AUTH,
        })
        .remainingAccounts(remainingAccounts)
        .instruction();
}

export {
    buyIx
}