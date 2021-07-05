const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom is required!",
    ref: "chatRoom"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom is required!",
    ref: "User"
  },
  message: {
    type: String,
    required: "Message is required!"
  }
});

module.exports = mongoose.model("message", messageSchema);
