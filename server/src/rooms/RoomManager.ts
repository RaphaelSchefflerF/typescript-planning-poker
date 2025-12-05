import { Room, Participant } from "./RoomTypes";
import { v4 as uuidv4 } from "uuid";

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  constructor() {
    // Cleanup interval: remove rooms older than 24 hours
    setInterval(() => this.cleanupRooms(), 60 * 60 * 1000);
  }

  createRoom(adminId: string, userName: string, roomName?: string): Room {
    const roomId = uuidv4().substring(0, 8); // Short ID for easier sharing
    const newRoom: Room = {
      id: roomId,
      name: roomName || `Room ${roomId}`,
      admin: adminId,
      participants: [
        {
          id: adminId,
          name: userName,
          isAdmin: true,
          hasVoted: false,
        },
      ],
      votes: {},
      revealed: false,
      createdAt: Date.now(),
      settings: {
        cardDeck: ["0", "1", "2", "3", "5", "8", "13", "21", "?", "☕"],
        autoReveal: false,
      },
    };

    this.rooms.set(roomId, newRoom);
    return newRoom;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  joinRoom(roomId: string, userId: string, userName: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    const existingParticipant = room.participants.find((p) => p.id === userId);
    if (!existingParticipant) {
      room.participants.push({
        id: userId,
        name: userName,
        isAdmin: false,
        hasVoted: false,
      });
    }

    return room;
  }

  leaveRoom(roomId: string, userId: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    room.participants = room.participants.filter((p) => p.id !== userId);
    delete room.votes[userId];

    // If admin leaves, assign new admin if there are other participants
    if (room.admin === userId && room.participants.length > 0) {
      room.admin = room.participants[0].id;
      room.participants[0].isAdmin = true;
    }

    // If room is empty, remove it
    if (room.participants.length === 0) {
      this.rooms.delete(roomId);
      return undefined;
    }

    return room;
  }

  removeUser(
    roomId: string,
    adminId: string,
    userIdToRemove: string
  ): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room || room.admin !== adminId) return undefined;

    // Cannot remove self (use leaveRoom instead)
    if (adminId === userIdToRemove) return undefined;

    room.participants = room.participants.filter(
      (p) => p.id !== userIdToRemove
    );
    delete room.votes[userIdToRemove];

    return room;
  }

  submitVote(roomId: string, userId: string, vote: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    const participant = room.participants.find((p) => p.id === userId);
    if (participant) {
      participant.hasVoted = true;
      participant.vote = vote;
      room.votes[userId] = vote;
    }

    return room;
  }

  revealVotes(roomId: string, adminId: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room || room.admin !== adminId) return undefined;

    room.revealed = true;
    return room;
  }

  resetVotes(roomId: string, adminId: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room || room.admin !== adminId) return undefined;

    room.revealed = false;
    room.votes = {};
    room.participants.forEach((p) => {
      p.hasVoted = false;
      delete p.vote;
    });

    return room;
  }

  private cleanupRooms() {
    const now = Date.now();
    const timeout = 24 * 60 * 60 * 1000; // 24 hours

    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.createdAt > timeout) {
        this.rooms.delete(roomId);
      }
    }
  }
}
