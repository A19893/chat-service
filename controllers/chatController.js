const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const createChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId params not sent with request");
    return res.status(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const CreateChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: CreateChat._id }).populate(
        "users",
        "-password"
      );

      res.status(201).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const Chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    const allChats = await User.populate(Chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).send(allChats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).send("More than 2 users required to have a group");
  }
  users.push(req.user._id);
  var chatData = {
    chatName: req.body.chatName,
    isGroupChat: true,
    users: users,
    groupAdmin: req.user._id,
  };
  try {
    const GroupChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: GroupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).send(FullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatName, chatId } = req.body;
  try {
    const UpdatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
      if(!UpdatedChat){
        res.status(404);
        throw new Error('Chat Not Found') 
      }
    res.status(200).send(UpdatedChat);
  } catch (error) { 
    res.status(400);
    throw new Error(error.message);
  }
};

const addToGroup = async (req, res) => {
  const {chatId, userId} = req.body;
   const UpdatedChat = await Chat.findByIdAndUpdate(
     chatId,
     {$push: {users: userId} },
     { new: true }
   )
     .populate("users", "-password")
     .populate("groupAdmin", "-password");
   if (!UpdatedChat) {
     res.status(404);
     throw new Error("Chat Not Found");
   }
   res.status(200).send(UpdatedChat);
};

const removeGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const UpdatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!UpdatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  }
  res.status(200).send(UpdatedChat);
};
module.exports = {
  createGroupChat,
  renameGroup,
  createChat,
  fetchChats,
  removeGroup,
  addToGroup,
};
