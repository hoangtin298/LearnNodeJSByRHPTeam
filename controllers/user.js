/**
 * We can interact with mongoose in three different ways:
 * - Callback
 * - Promise
 * - Async - wait
 */

const User = require("../models/User");
const Deck = require("../models/Deck");

const { JWT_SECRET } = require("../configs");
const JWT = require("jsonwebtoken");

const encodedToken = (userID) => {
  return JWT.sign(
    {
      iss: "Hoang Tin",
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    JWT_SECRET
  );
};

const signUp = async (req, res, next) => {
  // Get information of body
  const { firstName, lastName, email, password } = req.value.body;
  // Check if email is already in database
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    return res.status(403).json({
      error: {
        message: "Email is already in database!",
      },
    });
  }
  // Create a new user
  const newUser = new User({ firstName, lastName, email, password });
  // Save
  await newUser.save();
  // Encode a token
  token = encodedToken(newUser._id);

  // Response to client
  res.setHeader("Authorization", token);
  return res.status(201).json({
    message: "Sign up success",
    newUser,
  });
};

const signIn = async (req, res, next) => {
  console.log("call api sign in");
};

const secret = async (req, res, next) => {
  console.log("call api secret");
};

const index = async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({ users });
};

const newUser = async (req, res, next) => {
  // Create object model
  const newUser = new User(req.value.body);
  // Save
  await newUser.save();
  return res.status(201).json({ user: newUser });
};

const getUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const user = await User.findById(userID);
  return res.status(200).json({ user });
};

const replaceUser = async (req, res, next) => {
  // Enforce new user to old user
  const { userID } = req.value.params;
  // Get new field
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userID, newUser, { new: true });
  return res.status(200).json({ message: "Success", user: result });
};

const updateUser = async (req, res, next) => {
  // Change some field
  const { userID } = req.value.params;
  // Get new field
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userID, newUser, { new: true });
  return res.status(200).json({ message: "Success", user: result });
};

const getUserDecks = async (req, res, next) => {
  const { userID } = req.value.params;
  // Get user
  const user = await User.findById(userID).populate("decks");
  // Response to client
  return res.status(200).json({
    message: "Get success",
    decks: user.decks,
  });
};

const newUserDeck = async (req, res, next) => {
  const { userID } = req.value.params;
  // Create a new deck
  const newDeck = new Deck(req.value.body);
  // Get user
  const user = await User.findById(userID);
  // Assign user as a owner of a deck
  newDeck.owner = user;
  // Save the deck
  await newDeck.save();
  // Push the deck to user.decks (array)
  // Just save the _id
  user.decks.push(newDeck._id);
  // Save user after push to decks array
  await user.save();
  // Response to client
  return res.status(201).json({
    message: "Create new deck success",
    deck: newDeck,
  });
};

module.exports = {
  index,
  newUser,
  getUser,
  replaceUser,
  updateUser,
  getUserDecks,
  newUserDeck,
  signUp,
  signIn,
  secret,
};
