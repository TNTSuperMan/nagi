const express = require("express");
const { default: z } = require("zod");

const app = express.Router();

const passwordLoginSchema = z.object({
    username: z.string().max(256),
    password: z.string()
});

app.post("/", (req, res) => {
    try{
        const body = passwordLoginSchema.parse(req.body);
    }catch(err){
      res.status(400).json({ error: "バリデーションに失敗しました", info: err.errors });
    }
})

module.exports = app;
