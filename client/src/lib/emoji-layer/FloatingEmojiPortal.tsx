import ReactDOM from "react-dom";
import { useEmojiLayer } from "./EmojiLayerProvider";

export const FloatingEmojiPortal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const layerRef = useEmojiLayer();

  return layerRef.current
    ? ReactDOM.createPortal(children, layerRef.current)
    : null;
};
