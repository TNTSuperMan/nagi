const express = require("express");
const z = require("zod");
const login = require("../../../controllers/login.js");
const session = require("../../../controllers/session.js");

const app = express.Router();

const passwordLoginSchema = z.object({
  username: z.string().max(256),
  password: z.string(),
});

app.post("/", function (req, res, next) {
  const body = passwordLoginSchema.parse(req.body);

  login(body.username, body.password, function (result) {
    switch (result.type) {
    case "forbidden":
      res.status(403).json({ error: "ユーザー名かパスワードが異なります" });
      break;
    case "success":
      session.login(result.id, req.session, function (err) {
        if (err) {
          next(err);
        } else {
          res.status(200).json({ message: "成功しました" });
        }
      });
      break;
    case "needs_2FA":
      session.start_challenge(result.id, req.session, function (err) {
        if (err) {
          next(err);
        } else {
          res.status(202).json({ message: "二段階認証が必要です", next: result.next });
        }
      });
      break;
    }
  });
});

module.exports = app;
