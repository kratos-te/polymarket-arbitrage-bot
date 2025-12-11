import { config } from "dotenv";

config()

const privateKey = process.env.PRIVATE_KEY || (console.log("PRIVATE_KEY is not set"), process.exit());
const mainnetPRC = process.env.MAINNET_RPC || (console.log("MAINNET_RPC is not set"), process.exit());
const baseMint = process.env.BASE_MINT || (console.log("BASE_MINT is not set"), process.exit());
const quoteMint = process.env.QUOTE_MINT || (console.log("QUOTE_MINT is not set"), process.exit());
const upperAmountWithDecimal = parseInt(process.env.UPPER_AMOUNT_WITH_DECIMAL || "0")

export {
    privateKey,
    mainnetPRC,
    baseMint,
    quoteMint,
    upperAmountWithDecimal
}