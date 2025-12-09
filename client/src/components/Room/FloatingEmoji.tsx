import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FloatingEmojiProps {
  emoji: string;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  onComplete: () => void;
}

export const FloatingEmoji: React.FC<FloatingEmojiProps> = ({
  emoji,
  startPos,
  endPos,
  onComplete,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: startPos.x, y: startPos.y, opacity: 1, scale: 0.5 }}
        animate={{
          x: endPos.x,
          y: endPos.y,
          opacity: 1,
          scale: [0.5, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{ duration: 0.8, ease: "easeIn" }}
        onAnimationComplete={onComplete}
        className="fixed pointer-events-none z-50 text-4xl"
      >
        {emoji}
      </motion.div>
    </AnimatePresence>
  );
};
