const webpack = require("webpack");

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
