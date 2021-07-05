const mongoose = require("mongoose");
const chatRoom = mongoose.model("chatRoom");

exports.createChatRoom = async(req, res) => {
  console.log(req);
  const {name} = req.headers;

  const nameRegex = /^[A-Za-z\s]+$/;

  if(!nameRegex.test(name)) throw "Chatroom name can have only alphabets";

  const chatRoomAlreadyExists = await chatRoom.findOne({name});

  if(chatRoomAlreadyExists) throw "Chatroom already exists!";

  const chatroom = new chatRoom({
    name
  });

  await chatroom.save();

  res.json({
    message: "Chat Room created!"
  });
};

exports.getAllChatRooms = async (req, res) => {
  const chatrooms = await chatRoom.find({});

  res.json(chatrooms);
};
