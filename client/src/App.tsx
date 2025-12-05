import { useRoomStore } from "./stores/roomStore";
import { HomePage } from "./components/Landing/HomePage";
import { PokerTable } from "./components/Room/PokerTable";
import { useSocketListener } from "./hooks/useSocketListener";

function App() {
  useSocketListener();
  const room = useRoomStore((state) => state.room);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {!room ? <HomePage /> : <PokerTable />}
    </div>
  );
}

export default App;
