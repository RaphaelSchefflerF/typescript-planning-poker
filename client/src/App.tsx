import { useEffect } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { HomePage } from "./components/Landing/HomePage";
import { PokerTable } from "./components/Room/PokerTable";
import { useSocketListener } from "./hooks/useSocketListener";
import { useRoomStore } from "./stores/roomStore";

function App() {
  useSocketListener();
  const room = useRoomStore((state) => state.room);
  const navigate = useNavigate();

  useEffect(() => {
    if (room) {
      navigate(`/room/${room.id}`);
    }
  }, [room, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join/:roomId" element={<HomePage />} />
        <Route
          path="/room/:roomId"
          element={room ? <PokerTable /> : <RedirectToHome />}
        />
        <Route path="/join" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

// A simple component to handle redirection.
const RedirectToHome = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      navigate(`/join/${roomId}`);
    } else {
      navigate("/");
    }
  }, [navigate, roomId]);

  return null;
};

export default App;
