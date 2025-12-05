import { create } from "zustand";
import { Room, Participant } from "../types/global";

interface RoomState {
  room: Room | null;
  userId: string | null;
  userName: string | null;
  isConnected: boolean;

  setRoom: (room: Room | null) => void;
  setUserId: (id: string) => void;
  setUserName: (name: string) => void;
  setIsConnected: (connected: boolean) => void;
  updateParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateVote: (userId: string, vote: string) => void;
  revealVotes: (votes: Record<string, string>) => void;
  resetVotes: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  room: null,
  userId: null,
  userName: null,
  isConnected: false,

  setRoom: (room) => set({ room }),
  setUserId: (userId) => set({ userId }),
  setUserName: (userName) => set({ userName }),
  setIsConnected: (isConnected) => set({ isConnected }),

  updateParticipant: (participant) =>
    set((state) => {
      if (!state.room) return state;
      const participants = [...state.room.participants];
      const index = participants.findIndex((p) => p.id === participant.id);

      if (index !== -1) {
        participants[index] = participant;
      } else {
        participants.push(participant);
      }

      return { room: { ...state.room, participants } };
    }),

  removeParticipant: (participantId) =>
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          participants: state.room.participants.filter(
            (p) => p.id !== participantId
          ),
        },
      };
    }),

  updateVote: (userId, vote) =>
    set((state) => {
      if (!state.room) return state;
      // Update participant status
      const participants = state.room.participants.map((p) =>
        p.id === userId ? { ...p, hasVoted: true, vote } : p
      );

      return {
        room: {
          ...state.room,
          participants,
          votes: { ...state.room.votes, [userId]: vote },
        },
      };
    }),

  revealVotes: (votes) =>
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          revealed: true,
          votes,
        },
      };
    }),

  resetVotes: () =>
    set((state) => {
      if (!state.room) return state;
      const participants = state.room.participants.map((p) => ({
        ...p,
        hasVoted: false,
        vote: undefined,
      }));
      return {
        room: {
          ...state.room,
          revealed: false,
          votes: {},
          participants,
        },
      };
    }),
}));
