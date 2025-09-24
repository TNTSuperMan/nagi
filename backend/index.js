const express = require("express");
const session = require("express-session");
const router = require("./routes/index.js");
const logger = require("./logger.js");
const PostgresStore = require("./store.js");
const postgres = require("./postgres.js");
const queueMiddleware = require("./queue.js");

const app = express();

app.use(express.json());
app.use(queueMiddleware);
app.use(session({
  secret: process.env.KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 },
  store: new PostgresStore({
    reader: postgres.reader_sql,
    writer: postgres.writer_sql,
  }),
}));

app.use("/api", router);

if(process.env.NODE_ENV === "production") {
  const assets = require("../build/assets.json");
  app.get("/", (_, res) => {
    const asset = assets["index.html"];
    if(!asset) {
      res.status(404).send(assets["404"] || "404 Not Found");
    } else {
      res.send(asset);
    }
  });
  app.get("/:name", (req, res) => {
    const asset = assets[req.params.name];
    if(!asset) {
      res.status(404).send(assets["404"] || "404 Not Found");
    } else {
      res.send(asset);
    }
  });
}

const port = parseInt(process.env.PORT) || 5103;

app.listen(port, () => {
  logger.info("凪のバックエンドサーバーが http://localhost:" + port + " で開始しました");
});
