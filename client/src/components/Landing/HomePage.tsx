import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { CreateRoom } from "./CreateRoom";
import { JoinRoom } from "./JoinRoom";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();

  const isJoinMode = location.pathname.startsWith("/join");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Nice Poker
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Real-time estimation tool for agile teams. Simple, fast, and
          effective.
        </p>
      </div>

      <div className="w-full max-w-md mb-8 flex p-1 bg-slate-800 rounded-xl">
        <button
          className={`flex-1 py-2 rounded-lg font-medium transition-all ${
            !isJoinMode
              ? "bg-blue-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
          onClick={() => navigate("/")}
        >
          Create Room
        </button>
        <button
          className={`flex-1 py-2 rounded-lg font-medium transition-all ${
            isJoinMode
              ? "bg-blue-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
          onClick={() => navigate("/join")}
        >
          Join Room
        </button>
      </div>

      <div className="w-full flex justify-center">
        {isJoinMode ? <JoinRoom initialRoomId={roomId} /> : <CreateRoom />}
      </div>
    </div>
  );
};
