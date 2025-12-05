import React from "react";
import { useRoomStore } from "../../stores/roomStore";
import { useSocket } from "../../hooks/useSocket";
import { Card } from "../UI/Card";

export const Participants: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const userId = useRoomStore((state) => state.userId);
  const socket = useSocket();

  if (!room) return null;

  const handleRemoveUser = (participantId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      socket?.emit("admin:remove-user", {
        roomId: room.id,
        userId: participantId,
      });
    }
  };

  return (
    <Card title="Participants" className="w-full max-w-xs h-fit">
      <div className="space-y-3">
        {room.participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-700/50"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  participant.hasVoted ? "bg-green-500" : "bg-slate-500"
                }`}
              />
              <span className="font-medium text-white">
                {participant.name}
                {participant.isAdmin && (
                  <span className="ml-2 text-xs text-yellow-500">👑</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {room.revealed && participant.vote && (
                <div className="w-8 h-8 flex items-center justify-center bg-white text-slate-900 rounded font-bold">
                  {participant.vote}
                </div>
              )}
              {!room.revealed && participant.hasVoted && (
                <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded">
                  ✓
                </div>
              )}
              {room.admin === userId && !participant.isAdmin && (
                <button
                  onClick={() => handleRemoveUser(participant.id)}
                  className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20"
                  title="Remove User"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
