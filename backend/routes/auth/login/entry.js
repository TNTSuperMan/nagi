const express = require("express");
const bcrypt = require("bcrypt");
const z = require("zod");
const postgres = require("../../../postgres.js");
const logger = require("../../../logger.js");
const consts = require("../../../consts.js");

const limit = require("./limit.js");

const app = express.Router();

const passwordLoginSchema = z.object({
  username: z.string().max(256),
  password: z.string(),
});

app.post("/", limit, async (req, res, next) => {
  try{
    const body = passwordLoginSchema.parse(req.body);

    const result = await postgres.reader_sql`SELECT id, password_hash, totp_secret FROM users WHERE handle = ${body.username}`;
    if(!result.length){
      return res.status(403).json({ error: "ユーザー名かパスワードが異なります" });
    }
    if(!await bcrypt.compare(body.password, result[0].password_hash)){
      return res.status(403).json({ error: "ユーザー名かパスワードが異なります" });
    }
    await new Promise(resolve => req.session.regenerate(async (err) => {
      if(err){
        logger.error("セッションIDの再発行に失敗しました: ", err);
        res.status(500).json({ error: "内部エラーが発生しました" });
        resolve();
      }
      const auths = [];
      if(result[0].totp_secret){
        auths.push("totp");
      }
      const webauthn_result = await postgres.reader_sql`SELECT COUNT(*) FROM webauthn_credentials WHERE user_handle = ${result[0].id};`;
      if(parseInt(webauthn_result[0].count)){
        auths.push("webauthn");
      }
      
      if(auths.length){
        req.session.expires = Date.now() + consts.CHALLENGE_EXPIRES_MS;
        req.session.userId = result[0].id;
        req.session.mode = "challenge";
        res.status(202).json({ message: "二段階認証が必要です", next: auths });
      }else{
        req.session.expires = Date.now() + consts.SESSION_EXPIRES_MS;
        req.session.userId = result[0].id;
        req.session.mode = "session";
        res.json({ message: "成功しました" });
      }
      resolve();
    }));
  }catch(err){
    if(err instanceof z.ZodError){
      res.status(400).json({ error: "バリデーションに失敗しました", info: err.errors });
    }else{
      next(err);
    }
  }
});

module.exports = app;
