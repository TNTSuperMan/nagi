const express = require("express");
const session = require("express-session");
const path = require("path");
const router = require("./routes/index.js");
const logger = require("./logger.js");

const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
}));

app.use("/api", router);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/dist")));
}

const port = parseInt(process.env.PORT) || 5103;

app.listen(port, () => {
  logger.info("凪のバックエンドサーバーが http://localhost:" + port + " で開始しました");
});
