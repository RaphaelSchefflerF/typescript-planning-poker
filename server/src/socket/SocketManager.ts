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
      });
    });
  }
}
