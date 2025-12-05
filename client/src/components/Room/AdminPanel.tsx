import React from "react";
import { useRoomStore } from "../../stores/roomStore";
import { useSocket } from "../../hooks/useSocket";
import { Button } from "../UI/Button";

export const AdminPanel: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const userId = useRoomStore((state) => state.userId);
  const socket = useSocket();

  if (!room || !userId || room.admin !== userId) return null;

  const handleReveal = () => {
    socket?.emit("vote:reveal", room.id);
  };

  const handleReset = () => {
    socket?.emit("vote:reset", room.id);
  };

  return (
    <div className="flex gap-4 justify-center p-4 bg-slate-800/50 rounded-xl backdrop-blur-sm">
      <Button onClick={handleReveal} disabled={room.revealed} className="w-32">
        Reveal Votes
      </Button>
      <Button onClick={handleReset} variant="secondary" className="w-32">
        Reset Votes
      </Button>
    </div>
  );
};
