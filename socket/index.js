import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
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
  console.log(`the socket is live with id  ${socket.id}`);

  socket.on("newUser", (userId) => {
    newUser(userId, socket.id);
    console.log(onlineUsers);
  });
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
    console.log(receiverId, "receiver");
    console.log(data, "data");
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(4000);
