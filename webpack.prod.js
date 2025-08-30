const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const asset_paths = fs.readdirSync("./frontend/dist", { recursive: true, encoding: "utf8" });
const assets_entry = asset_paths.map(e=>[
  e,
  fs.readFileSync(path.resolve("./frontend/dist", e)).toString(),
]);
const assets_obj = Object.fromEntries(assets_entry);
const assets_json = JSON.stringify(assets_obj);
if(!fs.existsSync("./build")) {
  fs.mkdirSync("./build");
}
fs.writeFileSync("./build/assets.json", assets_json);

module.exports = {
  name: "backend",
  target: "node",
  mode: "production",
  entry: "./backend/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "server.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
};
