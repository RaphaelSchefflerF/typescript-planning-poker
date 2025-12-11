import { Server, Socket } from "socket.io";
import { RoomManager } from "../rooms/RoomManager";
import { CreateRoomDto, JoinRoomDto } from "../rooms/RoomTypes";

export const registerSocketEvents = (
  io: Server,
  socket: Socket,
  roomManager: RoomManager
) => {
  /**
   * User event
   * @description Create a room
   */
  socket.on("room:create", (data: CreateRoomDto) => {
    console.log(
      `[Socket] User ${socket.id} creating room with name: ${data.roomName}`
    );
    const room = roomManager.createRoom(
      socket.id,
      data.userName,
      data.roomName
    );
    socket.join(room.id);
    console.log(`[Socket] Room created: ${room.id}`);
    socket.emit("room:created", { roomId: room.id, adminId: socket.id });
    socket.emit("room:joined", { room });
  });

  /**
   * User event
   * @description Join a room
   */
  socket.on("room:join", (data: JoinRoomDto) => {
    console.log(
      `[Socket] User ${socket.id} joining room ${data.roomId} as ${data.userName}`
    );
    const room = roomManager.joinRoom(data.roomId, socket.id, data.userName);
    if (room) {
      socket.join(room.id);
      console.log(
        `[Socket] User ${socket.id} joined room ${room.id} successfully`
      );

      socket.emit("room:joined", { room });

      const participant = room.participants.find((p) => p.id === socket.id);
      if (participant) {
        console.log(
          `[Socket] Broadcasting user:joined for ${participant.name} (${participant.id}) to room ${room.id}`
        );
        socket.to(room.id).emit("user:joined", { participant });
      } else {
        console.error(
          `[Socket] Error: Participant not found in room after join! Socket: ${socket.id}`
        );
      }
    } else {
      console.log(
        `[Socket] Room ${data.roomId} not found for user ${socket.id}`
      );
      socket.emit("error", { message: "Room not found" });
    }
  });

  /**
   * User event
   * @description Leave a room
   */
  socket.on("room:leave", (roomId: string) => {
    const room = roomManager.leaveRoom(roomId, socket.id);
    socket.leave(roomId);
    if (room) {
      io.to(roomId).emit("user:left", {
        userId: socket.id,
        newAdmin: room.admin,
      });
    }
  });

  /**
   * User event
   * @description Submit a vote in a room
   */
  socket.on(
    "vote:submit",
    ({ roomId, vote }: { roomId: string; vote: string }) => {
      const room = roomManager.submitVote(roomId, socket.id, vote);
      if (room) {
        io.to(roomId).emit("vote:received", { userId: socket.id, vote: vote });

        const allVoted = room.participants.every((p) => p.hasVoted);
        if (allVoted && room.settings.autoReveal) {
          roomManager.revealVotes(roomId, room.admin);
          io.to(roomId).emit("votes:revealed", { votes: room.votes });
        }
      }
    }
  );

  /**
   * User event
   * @description Reveal votes in a room
   */
  socket.on("vote:reveal", (roomId: string) => {
    const room = roomManager.revealVotes(roomId, socket.id);
    if (room) {
      io.to(roomId).emit("votes:revealed", { votes: room.votes });
    }
  });

  /**
   * Admin only event
   * @description Reset votes in a room
   */
  socket.on("vote:reset", (roomId: string) => {
    const room = roomManager.resetVotes(roomId, socket.id);
    if (room) {
      io.to(roomId).emit("votes:reset");
    }
  });

  /**
   * Admin only event
   * @description Remove a user from a room
   */
  socket.on(
    "admin:remove-user",
    ({ roomId, userId }: { roomId: string; userId: string }) => {
      const room = roomManager.removeUser(roomId, socket.id, userId);
      if (room) {
        io.to(userId).emit("user:kicked");
        const targetSocket = io.sockets.sockets.get(userId);
        if (targetSocket) {
          targetSocket.leave(roomId);
        }
        io.to(roomId).emit("user:left", { userId });
      }
    }
  );

  /**
   * User event
   * @description Throw an emoji
   */
  socket.on("emoji:throw", ({ roomId, emoji, fromId, toId }) => {
    io.to(roomId).emit("emoji:thrown", { emoji, fromId, toId });
  });
};
