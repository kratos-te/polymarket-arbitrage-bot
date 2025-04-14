import { Buffer } from "buffer";
import { RouteArgs, RoutePlanStep, Swap } from "../../types";

// Function to decode the swap type
function decodeSwap(data: Buffer, offset: number) {
    //    Contact to https://t.me/vvizardev
}

// Function for decoding extra fields for specific swaps
function decodeExtraFields(data: Buffer, swap: Swap, offset: number) {
    //    Contact to https://t.me/vvizardev
}

// Function to decode a Route Plan Step
function decodeRoutePlanStep(data: Buffer, offset: number) {
    //    Contact to https://t.me/vvizardev
}

// Function to decode the route arguments from a buffer
export function decodeRouteArgs(data: Buffer) {
    //    Contact to https://t.me/vvizardev
}

function toCamelCase(value: string): string {
    return value
        .replace(/[_\-\s]+(.)?/g, (_, chr) => chr ? chr.toUpperCase() : '')
        .replace(/^(.)/, (match) => match.toLowerCase());
}

