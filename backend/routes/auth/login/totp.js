const express = require("express");
const speakeasy = require("speakeasy");
const z = require("zod");
const postgres = require("../../../postgres.js");
const logger = require("../../../logger.js");
const consts = require("../../../consts");

const limit = require("./limit.js");

const app = express.Router();

const totpLoginSchema = z.object({
  token: z.number(),
});

app.post("/", limit, async (req, res, next) => {
  if(Date.now() > req.session.expires){
    return res.status(403).json({ error: "チャレンジが無効です、再読み込みしてください" });
  }
  if(req.session.mode !== "challenge"){
    return res.status(403).json({ error: "チャレンジが無効です、再読み込みしてください" });
  }

  try{
    const body = totpLoginSchema.parse(req.body);

    const result = await postgres.reader_sql`SELECT totp_secret FROM users WHERE id = ${req.session.userId}`;
    if(!result.rowCount){
      return res.status(403).json({ error: "ユーザー名かコードが異なります" });
    }
    if(!result.rows[0].totp_secret){
      return res.status(403).json({ error: "ユーザー名かコードが異なります" });
    }
    if(!speakeasy.totp.verify({
      secret: result.rows[0].totp_secret,
      encoding: "base64",
      token: body.token,
      window: 1,
    })){
      return res.status(403).json({ error: "ユーザー名かコードが異なります" });
    }
    req.session.regenerate((err) => {
      if(err){
        logger.error("セッションIDの再発行に失敗しました: ", err);
        res.status(500).json({ error: "内部エラーが発生しました" });
        return;
      }
      req.session.expires = Date.now() + consts.SESSION_EXPIRES_MS;
      req.session.userId = body.username;
      req.session.mode = "session";
      res.json({ message: "成功しました" });
    });
  }catch(err){
    if(err instanceof z.ZodError){
      res.status(400).json({ error: "バリデーションに失敗しました", info: err.errors });
    }else{
      next(err);
    }
  }
});

module.exports = app;
