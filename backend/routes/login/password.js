const express = require("express");
const bcrypt = require("bcrypt");
const pg = require("pg");
const z = require("zod");

const limit = require("./limit.js");

const app = express.Router();

const passwordLoginSchema = z.object({
    username: z.string().max(256),
    password: z.string()
});

app.post("/", limit, async (req, res, next) => {
    const reader_client = new pg.Client(process.env.POSTGRESQL_READER);
    await reader_client.connect();
    try{
        const body = passwordLoginSchema.parse(req.body);

        const result = await reader_client.query("SELECT password_hash FROM users WHERE handle = $1", [body.username]);
        if(!result.rowCount){
            return res.status(403).json({ error: "ユーザー名かパスワードが異なります" });
        }
        if(!await bcrypt.compare(body.password, result.rows[0].password_hash)){
            return res.status(403).json({ error: "ユーザー名かパスワードが異なります" });
        }
        req.session.regenerate((err) => {
            if(err){
                console.error("セッションIDの再発行に失敗: ", err);
                res.status(500).json({ error: "内部エラーが発生しました" });
                return;
            }
            req.session.userId = body.username;
            res.json({ message: "成功しました" });
        });
    }catch(err){
        if(err instanceof z.ZodError){
            res.status(400).json({ error: "バリデーションに失敗しました", info: err.errors });
        }else{
            next(err);
        }
    }finally{
        await reader_client.end();
    }
})

module.exports = app;
