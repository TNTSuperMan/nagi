const express = require("express");
const session = require("../../controllers/session.js");
const user = require("../../models/user.js");

const app = express.Router();

app.post("/", function (req, res, next) {
  session.validate(req, function (err, id) {
    if (err) {
      next(err);
    } else if(!id) {
      res.json(null);
    } else {
      user.from_id(id, function (user) {
        res.json({
          id: user.id,
          handle: user.handle,
          displayName: user.displayName,
          expires: new Date(req.session.expires).toISOString(),
        });
      });
    }
  });
});

module.exports = app;
