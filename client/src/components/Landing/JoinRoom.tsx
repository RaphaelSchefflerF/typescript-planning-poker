import React, { useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card";

export const JoinRoom: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const socket = useSocket();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim() || !userName.trim() || !socket) return;

    socket.emit("room:join", {
      roomId: roomId.trim(),
      userName: userName.trim(),
    });
  };

  return (
    <Card title="Join Existing Room" className="w-full max-w-md">
      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Room ID
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            placeholder="Enter Room ID"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            placeholder="Enter your name"
            required
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={!roomId.trim() || !userName.trim()}
        >
          Join Room
        </Button>
      </form>
    </Card>
  );
};
