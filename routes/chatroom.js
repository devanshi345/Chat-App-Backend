const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatRoomController = require("../controllers/chatRoomController");

const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(chatRoomController.getAllChatRooms));
router.post("/", auth, catchErrors(chatRoomController.createChatRoom));

module.exports = router;
