import React, { useState, useRef, useEffect } from "react";
import { useRoomStore } from "../../stores/roomStore";
import { socket } from "../../lib/socket";
import { CardDeck } from "./CardDeck";
import { AdminPanel } from "./AdminPanel";
import { InviteModal } from "./InviteModal";
import { Button } from "../UI/Button";
import { Seat } from "./Seat";
import { Table } from "./Table";
import { FloatingEmoji } from "./FloatingEmoji";

interface FlyingEmoji {
  id: string;
  emoji: string;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
}

export const PokerTable: React.FC = () => {
  const room = useRoomStore((state) => state.room);
  const userId = useRoomStore((state) => state.userId);
  const [showInvite, setShowInvite] = useState(false);
  const [flyingEmojis, setFlyingEmojis] = useState<FlyingEmoji[]>([]);

  // Refs to track seat positions for emoji targeting
  const seatRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  if (!room) return null;

  const averageVote = React.useMemo(() => {
    if (!room.revealed) return null;
    const votes = Object.values(room.votes).filter((v) => !isNaN(Number(v)));
    if (votes.length === 0) return null;
    const sum = votes.reduce((a, b) => a + Number(b), 0);
    return (sum / votes.length).toFixed(1);
  }, [room.revealed, room.votes]);

  useEffect(() => {
    const handleEmojiThrown = ({
      emoji,
      toId,
    }: {
      emoji: string;
      fromId: string;
      toId: string;
    }) => {
      const endNode = seatRefs.current.get(toId);

      if (endNode) {
        const endRect = endNode.getBoundingClientRect();

        // Random start position from sides of screen (as requested)
        const side = Math.random() > 0.5 ? "left" : "right";
        const startX = side === "left" ? -100 : window.innerWidth + 100;
        const startY = Math.random() * window.innerHeight;

        // Calculate center of target with Y offset to hit the card
        const targetCenterX = endRect.left + endRect.width / 2;
        const targetCenterY = endRect.top + endRect.height / 2 - 30;

        setFlyingEmojis((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            emoji,
            startPos: { x: startX, y: startY },
            endPos: {
              x: targetCenterX,
              y: targetCenterY,
            },
          },
        ]);
      }
    };

    socket.on("emoji:thrown", handleEmojiThrown);
    return () => {
      socket.off("emoji:thrown", handleEmojiThrown);
    };
  }, []);

  const handleThrowEmoji = (emoji: string, targetId: string) => {
    if (!userId) return;

    // Emit event
    socket.emit("emoji:throw", {
      roomId: room.id,
      emoji: emoji,
      fromId: userId,
      toId: targetId,
    });
  };

  // --- Circular Layout Logic ---
  const TABLE_WIDTH = 600;
  const TABLE_HEIGHT = 300;
  const RADIUS_X = TABLE_WIDTH / 2 + 120; // Table half width + buffer
  const RADIUS_Y = TABLE_HEIGHT / 2 + 100; // Table half height + buffer

  const otherParticipants = room.participants.filter((p) => p.id !== userId);
  const currentUser = room.participants.find((p) => p.id === userId);

  const getSeatPosition = (index: number, total: number) => {
    // Distribute participants in an ellipse
    // Start from -PI (left) and go clockwise to 0 (right)
    // Simple approach: Distribute evenly around the upper arc (-180 to 0 degrees)
    // plus a bit of the sides.
    const startAngle = Math.PI; // 180 deg (Left)
    const endAngle = 0; // 0 deg (Right)

    // If we have many users, we might wrap around more.
    const angleStep = (startAngle - endAngle) / (total > 1 ? total - 1 : 1);

    const angle = startAngle - index * angleStep;

    const left = Math.cos(angle) * RADIUS_X;
    const top = -Math.sin(angle) * RADIUS_Y; // Negative is up (inverting to place on top arc)

    return { left, top };
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden relative flex flex-col items-center">
      <header className="absolute top-4 left-8 z-10">
        <h1 className="text-xl font-bold text-white">{room.name}</h1>
        <p className="text-slate-400 text-sm">ID: {room.id}</p>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowInvite(true)}
          >
            Invite
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400"
            onClick={() => window.location.reload()}
          >
            Leave
          </Button>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        <div className="relative flex items-center justify-center">
          {/* Central Table */}
          <div className="relative z-10">
            <Table revealed={room.revealed} averageVote={averageVote} />
          </div>

          {/* Seats Container (Centered on Table) */}
          <div className="absolute inset-0 pointer-events-none">
            {otherParticipants.map((p, index) => {
              const { left, top } = getSeatPosition(
                index,
                otherParticipants.length
              );
              // Adjust for seat center
              const style = {
                transform: `translate(${left}px, ${top - 60}px)`, // Shift up a bit to center visually
                left: "50%",
                top: "50%",
                position: "absolute" as const,
              };

              return (
                <div
                  key={p.id}
                  style={style}
                  className="pointer-events-auto w-0 h-0 flex items-center justify-center"
                >
                  <div className="-translate-x-1/2 -translate-y-1/2">
                    <Seat
                      ref={(el) => {
                        if (el) seatRefs.current.set(p.id, el);
                      }}
                      participant={p}
                      isRevealed={room.revealed}
                      isCurrentUser={false}
                      onEmojiSelect={handleThrowEmoji}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current User Seat - Fixed at bottom center */}
          {currentUser && (
            <div className="absolute bottom-[-180px] z-20">
              <Seat
                ref={(el) => {
                  if (el) seatRefs.current.set(currentUser.id, el);
                }}
                participant={currentUser}
                isRevealed={room.revealed}
                isCurrentUser={true}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 z-30">
        <CardDeck />
      </div>

      {room.admin === userId && (
        <div className="absolute bottom-8 right-8 z-30">
          <AdminPanel />
        </div>
      )}

      {/* Floating Emojis Layer */}
      {flyingEmojis.map((anim) => (
        <FloatingEmoji
          key={anim.id}
          emoji={anim.emoji}
          startPos={anim.startPos}
          endPos={anim.endPos}
          onComplete={() =>
            setFlyingEmojis((prev) => prev.filter((p) => p.id !== anim.id))
          }
        />
      ))}

      <InviteModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        roomId={room.id}
      />
    </div>
  );
};
