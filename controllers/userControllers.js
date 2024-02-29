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
  const token = generateToken();
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
  const token = generateToken();
  res.status(200).json({
    success: true,
    data: existingUser,
    err: {},
    token: token,
  });
});
module.exports = { registerUser, authUser };
