const express = require("express");

const entry = require("./entry.js");
const totp = require("./totp.js");

const app = express.Router();

app.use("/", entry);
app.use("/totp", totp);

module.exports = app;
