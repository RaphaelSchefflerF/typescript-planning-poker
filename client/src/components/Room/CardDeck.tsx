import React from "react";
import { useRoomStore } from "../../stores/roomStore";
import { useSocket } from "../../hooks/useSocket";

export const CardDeck: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const userId = useRoomStore((state) => state.userId);
  const updateVote = useRoomStore((state) => state.updateVote);
  const socket = useSocket();

  if (!room || !userId) return null;

  const currentVote = room.votes[userId];
  const cards = room.settings.cardDeck;

  const handleVote = (card: string) => {
    if (!socket) return;
    updateVote(userId, card);
    socket.emit("vote:submit", { roomId: room.id, vote: card });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-6">
      {cards.map((card) => (
        <button
          key={card}
          onClick={() => handleVote(card)}
          disabled={room.revealed}
          className={`
            w-16 h-20 rounded-xl text-2xl font-bold transition-all transform hover:-translate-y-2
            ${
              currentVote === card
                ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-400 scale-110"
                : "bg-white text-slate-900 shadow hover:shadow-xl"
            }
          `}
        >
          {card}
        </button>
      ))}
    </div>
  );
};
