import { AnchorProvider, Program } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection, Keypair } from "@solana/web3.js";
import idl from "../idl/idl.json";
import { JupiterRouteV6 } from "../idl/types";
import { mainnetPRC, privateKey } from "./loadEnv";

const connection = new Connection(mainnetPRC, "processed")
const payer = Keypair.fromSecretKey(bs58.decode(privateKey));

const wallet = new NodeWallet(payer);
const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
});

const program = new Program(idl as JupiterRouteV6, provider)

export {
    program,
    payer,
    connection
}