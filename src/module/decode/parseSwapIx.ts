import { Buffer } from "buffer";
import { RouteArgs, RoutePlanStep, Swap } from "../../types";

// Function to decode the swap type
function decodeSwap(data: Buffer, offset: number): { swap: Swap; newOffset: number } {
    const swapType = data.readUInt8(offset);
    return { swap: swapType as Swap, newOffset: offset + 1 };
}

// Function for decoding extra fields for specific swaps
function decodeExtraFields(data: Buffer, swap: Swap, offset: number): { extraFields: any; newOffset: number } {
    let extraFields: any = null;

    switch (swap) {
        case Swap.Crema:
            const a_to_b = data.readUInt8(offset) === 1;
            extraFields = { a_to_b };
            return { extraFields, newOffset: offset + 1 };
        case Swap.Serum:
        case Swap.Aldrin:
        case Swap.AldrinV2:
        case Swap.Openbook:
        case Swap.Phoenix:
        case Swap.Dradex:
            const side = data.readUInt8(offset);
            extraFields = { side };
            return { extraFields, newOffset: offset + 1 };
        case Swap.Whirlpool:
        case Swap.Invariant:
        case Swap.MarcoPolo:
        case Swap.Obric:
            const x_to_y_flag = data.readUInt8(offset) === 1; // Assuming it's a boolean
            extraFields = { x_to_y: x_to_y_flag };
            return { extraFields, newOffset: offset + 1 };
        case Swap.DeltaFi:
            const stable = data.readUInt8(offset) === 1; // bool
            extraFields = { stable };
            return { extraFields, newOffset: offset + 1 };
        case Swap.StakeDexSwapViaStake:
        case Swap.StakeDexPrefundWithdrawStakeAndDepositStake:
            const bridge_stake_seed = data.readUInt32LE(offset);
            extraFields = { bridge_stake_seed };
            return { extraFields, newOffset: offset + 4 };
        case Swap.Clone:
            const pool_index = data.readUInt8(offset);
            const quantity_is_input = data.readUInt8(offset + 1) === 1;
            const quantity_is_collateral = data.readUInt8(offset + 2) === 1;
            extraFields = { pool_index, quantity_is_input, quantity_is_collateral };
            return { extraFields, newOffset: offset + 3 };
        case Swap.Symmetry:
            const from_token_id = data.readBigUInt64LE(offset);
            const to_token_id = data.readBigUInt64LE(offset + 8);
            extraFields = { from_token_id, to_token_id };
            return { extraFields, newOffset: offset + 16 };
        case Swap.FoxClaimPartial:
            const is_y = data.readUInt8(offset) === 1;
            extraFields = { is_y };
            return { extraFields, newOffset: offset + 1 };
        case Swap.SolFi:
            const is_quote_to_base = data.readUInt8(offset) === 1;
            extraFields = { is_quote_to_base };
            return { extraFields, newOffset: offset + 1 };
        case Swap.Perena:
            const in_index = data.readUInt8(offset);
            const out_index = data.readUInt8(offset + 1);
            extraFields = { in_index, out_index };
            return { extraFields, newOffset: offset + 2 };
        case Swap.WhirlpoolSwapV2:
            const a_to_b_swap = data.readUInt8(offset) === 1;
            const remainingAccountsInfo = null; // Handle option type as needed
            extraFields = { a_to_b: a_to_b_swap, remaining_accounts_info: remainingAccountsInfo };
            return { extraFields, newOffset: offset + 1 };
        // Handle additional swaps as needed
        default:
            return { extraFields: {}, newOffset: offset };
    }
}

// Function to decode a Route Plan Step
function decodeRoutePlanStep(data: Buffer, offset: number): { routePlanStep: RoutePlanStep; newOffset: number } {

    const { swap, newOffset } = decodeSwap(data, offset);


    const { extraFields, newOffset: newOffsetAfterExtra } = decodeExtraFields(data, swap, newOffset);

    const percent = data.readUInt8(newOffsetAfterExtra);
    const inputIndex = data.readUInt8(newOffsetAfterExtra + 1);
    const outputIndex = data.readUInt8(newOffsetAfterExtra + 2);

    const routePlanStep: RoutePlanStep = {
        swap: {
            [toCamelCase(Swap[swap])]: extraFields,
        },
        percent,
        input_index: inputIndex,
        output_index: outputIndex
    };

    return { routePlanStep, newOffset: newOffsetAfterExtra + 2 }; // Return with updated offset
}

// Function to decode the route arguments from a buffer
export function decodeRouteArgs(data: Buffer): RouteArgs {
    let offset = 8;

    // Read the length of the route plan (assuming the first byte is the length)
    const routePlanLength = data.readUInt8(offset);
    offset += 4; // Move past the length byte

    const routePlan: RoutePlanStep[] = [];

    for (let i = 0; i < routePlanLength; i++) {
        const { routePlanStep, newOffset } = decodeRoutePlanStep(data, offset);
        routePlan.push(routePlanStep);

        offset = newOffset + 1; // Update to the new offset
    }

    // Decode other arguments
    const inAmount = data.readBigUInt64LE(offset);
    offset += 8;
    const quotedOutAmount = data.readBigUInt64LE(offset);
    offset += 8;
    const slippageBps = data.readUInt16LE(offset);
    offset += 2;
    const platformFeeBps = data.readUInt8(offset);

    return {
        route_plan: routePlan,
        in_amount: inAmount,
        quoted_out_amount: quotedOutAmount,
        slippage_bps: slippageBps,
        platform_fee_bps: platformFeeBps,
    };
}

function toCamelCase(value: string): string {
    return value
        .replace(/[_\-\s]+(.)?/g, (_, chr) => chr ? chr.toUpperCase() : '')
        .replace(/^(.)/, (match) => match.toLowerCase());
}

