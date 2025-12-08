export interface Participant {
  id: string;
  name: string;
  isAdmin: boolean;
  hasVoted: boolean;
  vote?: string;
}

export interface Room {
  id: string;
  name: string;
  admin: string;
  participants: Participant[];
  votes: Record<string, string>;
  revealed: boolean;
  createdAt: number;
  settings: {
    cardDeck: string[];
    autoReveal: boolean;
  };
}

export interface CreateRoomDto {
  userName: string;
  roomName?: string;
}

export interface JoinRoomDto {
  roomId: string;
  userName: string;
}
