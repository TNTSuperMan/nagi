const express = require("express");
const app = express.Router();

const session = require("./login/index.js");

app.use("/login", session);

app.get("/hello", (req, res) => {
    res.send("Hello!");
})

module.exports = app;
