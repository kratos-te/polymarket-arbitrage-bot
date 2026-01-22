// import { WebSocket } from "ws";

// export const USER_WS = new WebSocket("wss://ws-subscriptions-clob.polymarket.com/ws/market");

// USER_WS.onmessage = (event) => {
//     try {
//         const data = JSON.parse(event.data.toString());
//         if (data.event_type === "price_change") {
//             data.price_changes.forEach((priceChange: any) => {
//                 console.log("📨 Price change received:", priceChange);
//             });
//         }
//     } catch (error) {
//         console.error("❌ Error parsing websocket message:", error);
//         console.log("Raw message:", event.data);
//     }
// };

// USER_WS.onerror = (error) => {
//     console.error("❌ WebSocket error:", error);
// };

// USER_WS.onclose = (event) => {
//     console.log("🔌 WebSocket closed:", event.code, event.reason);
// };