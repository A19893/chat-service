const express = require("express");
const chats = require("../data/data");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(chats);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const chat = chats.find((chat) => chat._id === id);
  res.send(chat);
});

module.exports = router;
