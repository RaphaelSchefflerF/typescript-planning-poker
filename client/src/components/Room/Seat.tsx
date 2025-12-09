import { forwardRef, useState } from "react";
import { Participant } from "../../types/global";
import { UserEmojiMenu } from "./UserEmojiMenu";

interface SeatProps {
  participant: Participant;
  isRevealed: boolean;
  isCurrentUser: boolean;
  onEmojiSelect?: (emoji: string, targetId: string) => void;
}

export const Seat = forwardRef<HTMLDivElement, SeatProps>(
  ({ participant, isRevealed, isCurrentUser, onEmojiSelect }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          flex flex-col items-center gap-2 transition-transform hover:scale-105 relative
          ${isCurrentUser ? "z-20" : "z-10"}
        `}
      >
        <div
          className={`
            w-16 h-24 rounded-lg flex items-center justify-center shadow-xl border-2
            ${
              isRevealed && participant.vote
                ? "bg-blue-600 border-blue-400"
                : participant.hasVoted
                ? "bg-slate-700 border-blue-500 border-dashed"
                : "bg-slate-800 border-slate-600"
            }
          `}
        >
          {isRevealed && participant.vote ? (
            <span className="text-2xl font-bold text-white">
              {participant.vote}
            </span>
          ) : (
            participant.hasVoted && <span className="text-3xl">🃏</span>
          )}
        </div>

        {/* Helper Overlay for Emoji Selection */}
        {!isCurrentUser && isHovered && onEmojiSelect && (
          <UserEmojiMenu
            onSelectEmoji={(emoji) => onEmojiSelect(emoji, participant.id)}
            onClose={() => setIsHovered(false)}
          />
        )}

        <div className="text-center">
          <div className="text-sm font-bold text-white max-w-[100px] truncate">
            {participant.name}
            {isCurrentUser && " (You)"}
          </div>
          {participant.isAdmin && (
            <div className="text-xs text-yellow-400">Admin</div>
          )}
        </div>
      </div>
    );
  }
);

Seat.displayName = "Seat";
