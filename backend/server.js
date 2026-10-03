import app from "./app.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { config } from "dotenv";
import { dbConnection } from "./database/dbConnection.js";

config({ path: "./.env" });
dbConnection();

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: true, credentials: true }
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("join", ({ roomId, user }) => {
    socket.join(roomId);
    console.log(`${user} joined room: ${roomId}`);
  });
  socket.on("sendMessage", ({ room, sender, message }) => {
    io.to(room).emit("receiveMessage", { sender, message });
  });
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    console.log("Client disconnected:", socket.id);
  });
});
httpServer.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`IO Server running`);
});