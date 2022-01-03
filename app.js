// Config environment
require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const secureApp = require("helmet");
const logger = require("morgan");
const mongoClient = require("mongoose");

// Connect with mongoDB by mongoose
mongoClient
  .connect(
    "mongodb+srv://tinnh298:anhtindeptrai123@cluster0.m7sts.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("✅ Connected to database success");
  })
  .catch(() => {
    console.log(`❌ Connected to database is failed`);
  });

const app = express();

// Security
app.use(secureApp());

// Import routes
const userRoute = require("./routes/user");
const deckRoute = require("./routes/deck");

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());

// Routes
app.use("/users", userRoute);
app.use("/decks", deckRoute);

// Routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is OK",
  });
});

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// Start the server
const port = app.get("port") || 3000;
app.listen(port, () => console.log(`✅ Server is listening on port ${port}`));
