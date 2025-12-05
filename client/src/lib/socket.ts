import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.PROD ? "/" : "http://localhost:3000";

console.log("[Socket Singleton] Initializing socket with URL:", SOCKET_URL);

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  autoConnect: true,
});
