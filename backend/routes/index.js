const express = require("express");
const app = express.Router();

const auth = require("./auth");

app.use("/auth", auth);

app.get("/hello", function (req, res) {
  res.send("Hello!");
});

module.exports = app;
