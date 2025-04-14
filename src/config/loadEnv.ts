import { config } from "dotenv";

config()

const privateKey = process.env.PRIVATE_KEY || process.exit();
const mainnetPRC = process.env.MAINNET_RPC || process.exit();
const upperAmountWithDecimal = parseInt(process.env.UPPER_AMOUNT_WITH_DECIMAL || "0")

export {
    privateKey,
    mainnetPRC,
    upperAmountWithDecimal
}