const express = require("express");
const path = require("path");
const router = require("./app.js");

const app = express();

app.use("/api", router);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../frontend/dist")));
}

const port = parseInt(process.env.PORT) || 5103;

app.listen(port, () => {
    console.log("凪のバックエンドサーバーが http://localhost:" + port + " で開始しました")
});
