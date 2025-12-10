import React from "react";
import { useRoomStore } from "../../stores/roomStore";
import { useSocket } from "../../hooks/useSocket";
import { Button } from "../UI/Button";

export const AdminPanel: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const userId = useRoomStore((state) => state.userId);
  const revealVotes = useRoomStore((state) => state.revealVotes);
  const socket = useSocket();

  if (!room || !userId || room.admin !== userId) return null;

  const handleReveal = () => {
    if (!socket) return;
    revealVotes(room.votes);
    socket.emit("vote:reveal", room.id);
  };

  const handleReset = () => {
    socket?.emit("vote:reset", room.id);
  };

  const isDisabled =
    room.revealed || Object.keys(room).length !== room.participants.length;

  return (
    <div className="flex gap-4 justify-center p-4 bg-slate-800/50 rounded-xl backdrop-blur-sm">
      <Button onClick={handleReveal} disabled={isDisabled} className="w-32">
        Reveal Votes
      </Button>
      <Button onClick={handleReset} variant="secondary" className="w-32">
        Reset Votes
      </Button>
    </div>
  );
};
