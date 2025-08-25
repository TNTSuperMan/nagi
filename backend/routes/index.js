const express = require("express");
const app = express.Router();

const login = require("./login/index.js");
const session = require("./session.js");

app.use("/login", login);
app.use("/session", session);

app.get("/hello", (req, res) => {
  res.send("Hello!");
});

module.exports = app;
