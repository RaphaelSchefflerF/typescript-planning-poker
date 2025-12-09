import React, { useState, useEffect, useRef } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Button } from "../UI/Button";

interface UserEmojiMenuProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

const STORAGE_KEY = "planning_poker_recent_emojis";

export const UserEmojiMenu: React.FC<UserEmojiMenuProps> = ({
  onSelectEmoji,
  onClose,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent emojis from local storage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRecentEmojis(JSON.parse(stored));
    } else {
      // Default initial emojis
      setRecentEmojis(["👍", "👎", "👏", "🎉"]);
    }

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleEmojiClick = (emoji: string) => {
    onSelectEmoji(emoji);
    updateRecents(emoji);
    // Don't close to allow spamming
    // onClose();
  };

  const updateRecents = (emoji: string) => {
    const newRecents = [
      emoji,
      ...recentEmojis.filter((e) => e !== emoji),
    ].slice(0, 5);
    setRecentEmojis(newRecents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecents));
  };

  const onPickerEmojiClick = (emojiData: EmojiClickData) => {
    handleEmojiClick(emojiData.emoji);
  };

  // Determine picker position based on screen location
  const [pickerPos, setPickerPos] = useState<"top" | "bottom" | "side">("top");

  useEffect(() => {
    if (showPicker && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      // If too close to top, open below
      if (rect.top < 450) {
        setPickerPos("bottom");
      } else {
        setPickerPos("top");
      }
    }
  }, [showPicker]);

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-1/2 -translate-x-1/2 pb-4 z-50 flex flex-col items-center animate-in fade-in zoom-in duration-200"
    >
      <div className="bg-slate-800 rounded-full shadow-xl border border-slate-700 p-1 flex items-center">
        {recentEmojis.map((emoji) => (
          <button
            key={emoji}
            onClick={(e) => {
              e.stopPropagation();
              handleEmojiClick(emoji);
            }}
            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-slate-700 rounded-full transition-colors active:scale-90"
          >
            {emoji}
          </button>
        ))}
        <div className="w-px h-6 bg-slate-700 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full w-8 h-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setShowPicker(!showPicker);
          }}
        >
          ➕
        </Button>
      </div>

      {showPicker && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-50 ${
            pickerPos === "bottom" ? "top-12" : "bottom-12"
          }`}
        >
          <EmojiPicker
            onEmojiClick={onPickerEmojiClick}
            theme={Theme.DARK}
            lazyLoadEmojis={false}
            searchDisabled
            width={300}
            height={400}
          />
        </div>
      )}
    </div>
  );
};
