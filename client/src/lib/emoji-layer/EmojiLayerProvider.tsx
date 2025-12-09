import { useEffect, useRef } from "react";

export const useEmojiLayer = () => {
  const layerRef = useRef<HTMLDivElement | null>(null);

  if (!layerRef.current) {
    const div = document.createElement("div");
    div.id = "emoji-layer";
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.pointerEvents = "none";
    div.style.zIndex = "9999";
    layerRef.current = div;
  }

  useEffect(() => {
    document.body.appendChild(layerRef.current!);
    return () => {
      document.body.removeChild(layerRef.current!);
    };
  }, []);

  return layerRef;
};
