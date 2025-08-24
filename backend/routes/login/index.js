const express = require("express");

const password = require("./password");

const app = express.Router();

app.use("/password", password);

module.exports = app;
