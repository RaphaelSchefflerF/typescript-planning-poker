import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { SocketManager } from "./socket/SocketManager";
import path from "path";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from client build (for production)
const clientBuildPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientBuildPath));

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET", "POST"],
  },
});

new SocketManager(io);

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

server.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Network access: http://<your-ip>:${PORT}`);
});
