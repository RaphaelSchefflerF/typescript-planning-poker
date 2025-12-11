import { v4 as uuidv4 } from "uuid";
import { Room } from "./RoomTypes";
import { getRandomCard } from "../utils/getRandomCard";

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  constructor() {
    setInterval(() => this.cleanupRooms(), 60 * 60 * 1000);
  }

  /**
   * @description Create a room
   * @param adminId Admin ID
   * @param userName User name
   * @param roomName Room name
   * @returns Room
   */
  createRoom(adminId: string, userName: string, roomName?: string): Room {
    const roomId = uuidv4().substring(0, 8);
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

  /**
   * @description Get a room
   * @param roomId Room ID
   * @returns Room | undefined
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * @description Join a room
   * @param roomId Room ID
   * @param userId User ID
   * @param userName User name
   * @returns Room | undefined
   */
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

  /**
   * @description Leave a room
   * @param roomId Room ID
   * @param userId User ID
   * @returns Room | undefined
   */
  leaveRoom(roomId: string, userId: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    room.participants = room.participants.filter((p) => p.id !== userId);
    delete room.votes[userId];

    if (room.admin === userId && room.participants.length > 0) {
      room.admin = room.participants[0].id;
      room.participants[0].isAdmin = true;
    }
    if (room.participants.length === 0) {
      this.rooms.delete(roomId);
      return undefined;
    }

    return room;
  }

  /**
   * @description Remove a user from a room
   * @param roomId Room ID
   * @param adminId Admin ID
   * @param userIdToRemove User ID to remove
   * @returns Room | undefined
   */
  removeUser(
    roomId: string,
    adminId: string,
    userIdToRemove: string
  ): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room || room.admin !== adminId) return undefined;

    if (adminId === userIdToRemove) return undefined;

    room.participants = room.participants.filter(
      (p) => p.id !== userIdToRemove
    );
    delete room.votes[userIdToRemove];

    return room;
  }

  /**
   * @description Submit a vote in a room
   * @param roomId Room ID
   * @param userId User ID
   * @param vote Vote
   * @returns Room | undefined
   */
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

  /**
   * @description Reveal votes in a room
   * @param roomId Room ID
   * @param adminId Admin ID
   * @returns Room | undefined
   */
  revealVotes(roomId: string, adminId: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room || room.admin !== adminId) return undefined;

    room.revealed = true;

    Object.entries(room.votes).forEach(([userId, vote]) => {
      if (vote === "?") {
        const randomCard = getRandomCard();
        room.votes[userId] = randomCard;
      }
    });

    return room;
  }

  /**
   * @description Reset votes in a room
   * @param roomId Room ID
   * @param adminId Admin ID
   * @returns Room | undefined
   */
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

  /**
   * @description Cleanup rooms older than 24 hours
   */
  private cleanupRooms() {
    const now = Date.now();
    const timeout = 24 * 60 * 60 * 1000;
    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.createdAt > timeout) {
        this.rooms.delete(roomId);
      }
    }
  }
}
