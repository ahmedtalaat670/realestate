import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

const io = new Server(server, {
  cors: {
    origin: "https://your-frontend-domain.com",
  },
});

app.get("/", (req, res) => {
  res.send("Socket server is running 🚀");
});

let onlineUsers = [];

const newUser = (userId, socketId) => {
  const user = onlineUsers.find((user) => user.userId === userId);
  if (!user) {
    onlineUsers.push({ userId, socketId });
  } else {
    user.socketId = socketId;
  }
};

const getUser = (receiverId) => {
  return onlineUsers.find((user) => user.userId === receiverId);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("newUser", (userId) => {
    newUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
