import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card";

export const CreateRoom: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = ({ roomId }: { roomId: string }) => {
      navigate(`/join/${roomId}`);
    };

    socket.on("room:created", handleRoomCreated);

    return () => {
      socket.off("room:created", handleRoomCreated);
    };
  }, [socket, navigate]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !socket) return;

    socket.emit("room:create", {
      userName: userName.trim(),
      roomName: roomName.trim() || undefined,
    });
  };

  return (
    <Card title="Create New Room" className="w-full max-w-md">
      <form onSubmit={handleCreate} className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Room Name (Optional)
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            placeholder="e.g. Sprint Planning"
          />
        </div>
        <Button type="submit" className="w-full" disabled={!userName.trim()}>
          Create Room
        </Button>
      </form>
    </Card>
  );
};

