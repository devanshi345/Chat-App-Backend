require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection ERROR: " + err.message);
});

mongoose.connection.once("open" , () => {
  console.log("MongoDB connected!");
});

//Bring in all the models
require("./models/User");
require("./models/chatRoom");
require("./models/message");

const app = require("./app");

const server = app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

const io = require("socket.io")(server,{
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});
const jwt = require("jwt-then");

const Message = mongoose.model("message");
const User = mongoose.model("User");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);

    socket.userId = payload.id;
    next();
  }
  catch (e) {
    // console.log(e);
  }
});

io.on("connection", (socket) => {
  console.log("connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({chatRoomId}) => {
    socket.join(chatRoomId);
    console.log("A user joined Chatroom: "+ chatRoomId);
  });

  socket.on("leaveRoom", ({chatRoomId}) => {
    socket.leave(chatRoomId);
    console.log("A user left Chatroom: "+ chatRoomId);
  });

  socket.on("chatRoomMessage",async ({chatRoomId, message}) => {
    if(message.trim().length > 0) {
      const user = await User.findOne({_id: socket.userId});
      const newMessage = new Message({chatRoom: chatRoomId, user: socket.userId, message});

      io.to(chatRoomId).emit("newMessage", {
        message,
        name: user.name,
        userId: socket.userId
      });

      await newMessage.save();
    }
  });
});
