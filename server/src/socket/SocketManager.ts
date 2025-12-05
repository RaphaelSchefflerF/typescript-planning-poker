import { Server, Socket } from "socket.io";
import { RoomManager } from "../rooms/RoomManager";
import { registerSocketEvents } from "./events";

export class SocketManager {
  private io: Server;
  private roomManager: RoomManager;

  constructor(io: Server) {
    this.io = io;
    this.roomManager = new RoomManager();
    this.setup();
  }

  private setup() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);
      registerSocketEvents(this.io, socket, this.roomManager);

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Handle disconnection logic if needed (e.g., auto-leave rooms)
        // Note: Ideally we should track which room the user was in to efficiently leave it.
        // For simplicity, we might rely on client sending leave event or iterate (less efficient).
        // A better approach is to store socketId -> roomId mapping in RoomManager or here.
      });
    });
  }
}
