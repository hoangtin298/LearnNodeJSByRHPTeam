/**
 * We can interact with mongoose in three different ways:
 * - Callback
 * - Promise
 * - Async - wait
 */

const User = require("../models/User");

// const index = (req, res, next) => {
//   // Callback way
//   User.find({}, (err, users) => {
//     if (err) next(err);
//     return res.status(200).json({ users });
//   });
// };

const index = (req, res, next) => {
  // Promise way
  User.find({})
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((err) => next(err));
};

// const newUser = (req, res, next) => {
//   // Create object model
//   const newUser = new User(req.body);
//   // Save to database
//   newUser.save((err, user) => {
//     return res.status(201).json({ user });
//   });
// };

const newUser = (req, res, next) => {
  // Create object model
  const newUser = new User(req.body);
  newUser
    .save()
    .then((user) => {
      return res.status(201).json({ user });
    })
    .catch((err) => next(err));
};

module.exports = { index, newUser };
