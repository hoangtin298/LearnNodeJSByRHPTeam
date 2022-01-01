/**
 * We can interact with mongoose in three different ways:
 * - Callback
 * - Promise
 * - Async - wait
 */

const User = require("../models/User");

const index = async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({ users });
};

const newUser = async (req, res, next) => {
  // Create object model
  const newUser = new User(req.body);
  // Save
  await newUser.save();
  return res.status(201).json({ user: newUser });
};

const getUser = async (req, res, next) => {
  const { userID } = req.params;
  const user = await User.findById(userID);
  return res.status(200).json({ user });
};

const replaceUser = async (req, res, next) => {
  // Enforce new user to old user
  const { userID } = req.params;
  // Get new field
  const newUser = req.body;
  const result = await User.findByIdAndUpdate(userID, newUser, { new: true });
  return res.status(200).json({ message: "Success", user: result });
};

const updateUser = async (req, res, next) => {
  // Change some field
  const { userID } = req.params;
  // Get new field
  const newUser = req.body;
  const result = await User.findByIdAndUpdate(userID, newUser, { new: true });
  return res.status(200).json({ message: "Success", user: result });
};

module.exports = { index, newUser, getUser, replaceUser, updateUser };
