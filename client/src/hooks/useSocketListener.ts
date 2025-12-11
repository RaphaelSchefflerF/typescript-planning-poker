import { useEffect } from "react";
import { useRoomStore } from "../stores/roomStore";
import { socket } from "../lib/socket";
import { Room, Participant } from "../types/global";

export const useSocketListener = () => {
  const {
    setRoom,
    setUserId,
    setIsConnected,
    updateParticipant,
    removeParticipant,
    revealVotes,
    resetVotes,
  } = useRoomStore();

  useEffect(() => {
    // Connection events
    const onConnect = () => {
      console.log("[Client] Connected to socket server with ID:", socket.id);
      setIsConnected(true);
      if (socket.id) {
        setUserId(socket.id);
      }
    };

    const onDisconnect = (reason: string) => {
      console.log("[Client] Disconnected from socket server. Reason:", reason);
      setIsConnected(false);
    };

    const onConnectError = (error: Error) => {
      console.error("[Client] Connection error:", error);
    };

    // Room events
    const onRoomCreated = ({ roomId }: { roomId: string; adminId: string }) => {
      console.log("[Client] Room created:", roomId);
    };

    const onRoomJoined = ({ room }: { room: Room }) => {
      console.log("[Client] Joined room:", room);
      setRoom(room);
    };

    const onUserJoined = ({ participant }: { participant: Participant }) => {
      console.log("[Client] User joined event received:", participant);
      updateParticipant(participant);
    };

    const onUserLeft = ({
      userId,
      newAdmin,
    }: {
      userId: string;
      newAdmin?: string;
    }) => {
      console.log("[Client] User left:", userId);
      removeParticipant(userId);
      if (newAdmin) {
        // Handle admin change if needed
      }
    };

    const onUserKicked = () => {
      console.log("You have been kicked from the room");
      setRoom(null);
      // setUserId(null); // Keep socket ID
      setIsConnected(true);
      alert("You have been removed from the room by the admin.");
    };

    // Vote events
    const onVoteReceived = ({
      userId,
      vote,
    }: {
      userId: string;
      vote: string;
    }) => {
      console.log("Vote received from:", userId);
      // Optimistic update or wait for reveal?
      // Current logic in store updates participant status
      useRoomStore.getState().updateParticipant({
        ...useRoomStore
          .getState()
          .room?.participants.find((p) => p.id === userId)!,
        hasVoted: true,
      });

      useRoomStore.getState().updateVote(userId, vote);
    };

    const onVotesRevealed = ({ votes }: { votes: Record<string, string> }) => {
      revealVotes(votes);
    };

    const onVotesReset = () => {
      resetVotes();
    };

    // Register listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("room:created", onRoomCreated);
    socket.on("room:joined", onRoomJoined);
    socket.on("user:joined", onUserJoined);
    socket.on("user:left", onUserLeft);
    socket.on("user:kicked", onUserKicked);
    socket.on("vote:received", onVoteReceived);
    socket.on("votes:revealed", onVotesRevealed);
    socket.on("votes:reset", onVotesReset);

    // Initial check
    if (socket.connected) {
      onConnect();
    }

    // Cleanup
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("room:created", onRoomCreated);
      socket.off("room:joined", onRoomJoined);
      socket.off("user:joined", onUserJoined);
      socket.off("user:left", onUserLeft);
      socket.off("user:kicked", onUserKicked);
      socket.off("vote:received", onVoteReceived);
      socket.off("votes:revealed", onVotesRevealed);
      socket.off("votes:reset", onVotesReset);
    };
  }, [
    setRoom,
    setUserId,
    setIsConnected,
    updateParticipant,
    removeParticipant,
    revealVotes,
    resetVotes,
  ]);
};
