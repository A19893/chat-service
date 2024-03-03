require("dotenv").config();
require("colors");
const express = require("express");
const cors = require("cors");
const { userRoutes, chatRoutes, messageRoutes } = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const app = express();

app.use(cors());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb", extended: true }));

require("./config/dbConfig");

app.use("/api/user", userRoutes);
app.use('/api/chats', chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);
const server = app.listen(process.env.APP_PORT, function () {
  console.log(
    `Server is listening on port  ${process.env.APP_PORT}`.yellow.bold
  );
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000"
  }
})

io.on("connection", (socket) => {
  console.log(`Connected to socket.io`);
  
  socket.on('setup', (userData) => {
   socket.join(userData?._id);
   socket.emit("connected")
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User Joined Room: "+room)
  })

  socket.on('new message', (newMessageRecieved) => {
    let chat = newMessageRecieved.chat
    if(!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach((user)=>{
      if(user._id == newMessageRecieved.sender._id) return;
  
      socket.in(user._id).emit("message recieved", newMessageRecieved)
    })
  });
})