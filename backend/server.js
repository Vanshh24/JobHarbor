import app from "./app.js";
import cloudinary from "cloudinary";
import { Server } from "socket.io";
import { createServer } from "http";
import { config } from "dotenv";
import { dbConnection } from "./database/dbConnection.js";

config({ path: "./config/config.env" });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

dbConnection();
console.log("MONGODB URI: ", process.env.MONGODB_URI);

// 🔹 Set the port
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  }
});

const userSocketMap = {};
export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  console.log("New client connected:", socket.id);

  socket.on("welcome", (message) => {
    console.log("Received 'welcome' event from client:", message);
  });

  socket.emit("welcome", "message sent from server");

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

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`IO Server running at port ${PORT}`);
});