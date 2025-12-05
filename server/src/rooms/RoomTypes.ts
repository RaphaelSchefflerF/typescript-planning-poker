export interface Participant {
  id: string; // socket.id
  name: string;
  isAdmin: boolean;
  hasVoted: boolean;
  vote?: string;
}

export interface Room {
  id: string;
  name: string;
  admin: string; // socket.id of the admin
  participants: Participant[];
  votes: Record<string, string>; // socket.id -> vote
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
