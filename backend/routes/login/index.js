const express = require("express");

const password = require("./password.js");
const totp = require("./totp.js");

const app = express.Router();

app.use("/password", password);
app.use("/totp", totp);

module.exports = app;
