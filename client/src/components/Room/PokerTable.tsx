import React, { useState } from "react";
import { useRoomStore } from "../../stores/roomStore";
import { CardDeck } from "./CardDeck";
import { Participants } from "./Participants";
import { AdminPanel } from "./AdminPanel";
import { InviteModal } from "./InviteModal";
import { Button } from "../UI/Button";

export const PokerTable: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const userId = useRoomStore((state) => state.userId);
  const [showInvite, setShowInvite] = useState(false);

  if (!room) return null;

  const averageVote = React.useMemo(() => {
    if (!room.revealed) return null;
    const votes = Object.values(room.votes).filter((v) => !isNaN(Number(v)));
    if (votes.length === 0) return null;
    const sum = votes.reduce((a, b) => a + Number(b), 0);
    return (sum / votes.length).toFixed(1);
  }, [room.revealed, room.votes]);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{room.name}</h1>
          <p className="text-slate-400 text-sm">ID: {room.id}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowInvite(true)}
            variant="secondary"
            size="sm"
          >
            Invite
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            Leave
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Table Area */}
          <div className="min-h-[300px] bg-slate-800/30 rounded-3xl border-4 border-slate-700 flex flex-col items-center justify-center relative p-8">
            {room.revealed && averageVote && (
              <div className="absolute top-4 right-4 bg-blue-600 px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm text-blue-200 block">Average</span>
                <span className="text-2xl font-bold text-white">
                  {averageVote}
                </span>
              </div>
            )}

            <div className="mb-8 text-slate-400 font-medium">
              {room.revealed ? "Votes Revealed" : "Place your votes"}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {room.participants.map((p) => (
                <div
                  key={p.id}
                  className={`
                    w-16 h-24 rounded-lg border-2 flex items-center justify-center transition-all
                    ${
                      p.hasVoted
                        ? "bg-blue-600 border-blue-500 shadow-lg transform -translate-y-2"
                        : "bg-slate-800/50 border-slate-700 border-dashed"
                    }
                  `}
                >
                  {room.revealed && p.vote ? (
                    <span className="text-2xl font-bold text-white">
                      {p.vote}
                    </span>
                  ) : (
                    p.hasVoted && <span className="text-2xl">🃏</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <CardDeck />

          {room.admin === userId && <AdminPanel />}
        </div>

        <div className="lg:col-span-1">
          <Participants />
        </div>
      </div>

      <InviteModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        roomId={room.id}
      />
    </div>
  );
};
