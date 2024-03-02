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

router.route("/").post(protect, createChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/group-remove").put(protect, removeGroup);
router.route("/group-add").put(protect, addToGroup);

module.exports = router;
