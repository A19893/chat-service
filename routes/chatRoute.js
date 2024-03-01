const express = require("express");
const chats = require("../data/data");
const protect = require("../middlewares/authMiddleware");
const {
  createGroupChat,
  renameGroup,
  createChat,
  fetchChats,
  removeGroup,
  addToGroup,
} = require("../controllers/chatController");

const router = express.Router();

// router.get("/", protect, (req, res) => {
//   res.send(chats);
// });

router.get("/:id", protect, (req, res) => {
  const id = req.params.id;
  const chat = chats.find((chat) => chat._id === id);
  res.send(chat);
});

router.route("/").post(protect, createChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/group-remove").put(protect, removeGroup);
router.route("/group-add").put(protect, addToGroup);

module.exports = router;
