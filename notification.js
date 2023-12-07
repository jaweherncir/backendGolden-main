const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const server = http.createServer(app);
app.use("/public", express.static(path.join(__dirname, "uploads")));

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let users = [];
let notif = [];
let userSocket = {};

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

getUserEvent = (UserId, notifi) => {
  users.some((user) => user.userId === UserId) &&
    notif.push({ UserId, notifi });
  io.to(userSocket.id).emit("getNotif", notif);
};

io.on("connection", (socket) => {
  userSocket = socket;

  //when ceonnect
  console.log("a user connected.");
  io.emit("welcome", "hello this is socket server");
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
});

io.listen(8080);

module.exports = { getUserEvent };
