const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Bad request, Check the payload!");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  const registeredUser = await User.create({ name, email, password, pic });
  const token = generateToken(registeredUser._id);
  res.status(201).json({
    success: true,
    data: registeredUser,
    err: {},
    token: token,
  });
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Bad request, Check the payload!");
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser || !(await existingUser.matchPassword(password))) {
    res.status(400);
    throw new Error("User not exists!");
  }
  const token = generateToken(existingUser._id);
  res.status(200).json({
    success: true,
    data: existingUser,
    err: {},
    token: token,
  });
});

//api/User?search=piyush
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
 res.status(200).json({
   success: true,
   data: users,
   err: {},
 });
});
module.exports = { registerUser, authUser, allUsers };
