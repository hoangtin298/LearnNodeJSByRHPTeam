const Deck = require("../models/Deck");
const User = require("../models/User");

const index = async (req, res, next) => {
  const decks = await Deck.find({});

  return res.status(200).json({
    message: "Get success",
    decks,
  });
};

const newDeck = async (req, res, next) => {
  // Find owner
  const owner = await User.findById(req.value.body.owner);
  // Create a deck
  const deck = new Deck(req.value.body);
  // Make sure owner id is correct
  delete deck.owner;
  deck.owner = owner._id;

  const newDeck = new Deck(deck);
  await newDeck.save();

  // Add new deck to owner decks array
  owner.decks.push(newDeck._id);
  await owner.save();

  return res.status(201).json({
    message: "Create success",
    deck: newDeck,
  });
};

const getDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const deck = await Deck.findById(deckID);
  return res.status(200).json({
    message: "Get deck success",
    deck,
  });
};

const replaceDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(deckID, newDeck, { new: true });
  // Check if change the owner id, then remove deck in user's model
  return res.status(200).json({
    message: "Update success",
    deck: result,
  });
};

const updateDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const oldDeck = await Deck.findById(deckID);
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(deckID, newDeck, { new: true });
  // Check if change the owner id, then remove deck in user's model
  if (oldDeck.owner.toString() !== result.owner.toString()) {
    const oldOwner = await User.findById(oldDeck.owner.toString());
    const newOwner = await User.findById(result.owner.toString());

    oldOwner.decks.pull(oldDeck);
    await oldOwner.save();
    newOwner.decks.push(result.owner.toString());
    await newOwner.save();
  }
  return res.status(200).json({
    message: "Update success",
    deck: result,
  });
};

const deleteDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  // Get deck
  const deck = await Deck.findById(deckID);
  // Get the owner
  const ownerID = deck.owner;
  const owner = await User.findById(ownerID);
  // Remove the deck
  await deck.remove();
  // Remove deck from owner's deck array
  owner.decks.pull(deck);
  await owner.save();

  return res.status(200).json({
    message: "Delete success",
  });
};

module.exports = {
  index,
  getDeck,
  newDeck,
  replaceDeck,
  updateDeck,
  deleteDeck,
};
