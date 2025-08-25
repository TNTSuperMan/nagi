const express = require("express");

const app = express.Router();

const login = require("./login");
const session = require("./session.js");

app.use("/login", login);
app.use("/session", session);

module.exports = app;
