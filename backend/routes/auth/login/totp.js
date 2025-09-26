const express = require("express");
const speakeasy = require("speakeasy");
const z = require("zod");
const session = require("../../../controllers/session.js");

const app = express.Router();

const totpLoginSchema = z.object({
  token: z.number(),
});

app.post("/", function (req, res, next) {
  const body = totpLoginSchema.parse(req.body);

  session.validate_challenge(req, function (err, user) {
    if (err) {
      next(err);
    } else if (!user || !user.totp_secret) {
      res.status(403).json({ error: "ユーザー名かコードが異なります" });
    } else if(!speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base64",
      token: body.token,
      window: 1,
    })) {
      res.status(403).json({ error: "ユーザー名かコードが異なります" });
    } else {
      session.login(user.id, req, function (err) {
        if (err) {
          next(err);
        } else {
          res.json({ message: "成功しました" });
        }
      });
    }
  });
});

module.exports = app;
