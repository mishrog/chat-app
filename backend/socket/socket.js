import { Server } from "socket.io";
import http from "http"; // built in node module
import express from "express";

const app = express();

const server = http.createServer(app); // we will pass this express app into it

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
}); // we will pass out server into it

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

// for online users ids
const userSocketMap = {}; // {userId : socketId}

io.on("connection", (socket) => {
  console.log(`A user connected `, socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() is used to send events to all connected clients
  // whenever a user connects, below line sends event to all other users
  io.emit("getOnlineUsers",Object.keys(userSocketMap));
  // socket.on() method is used to listen to the events, can be used both on client and server side

  // check for disconnections
  socket.on("disconnect", () => {
    console.log(`User disconnected `, socket.id);
    delete userSocketMap[userId];
    // Update sent to all clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
  });
});
// socket is the user that is connected
export { app, io, server };
