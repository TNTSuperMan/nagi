const frontend = require("./webpack.frontend.js");

module.exports = [
  frontend,
  {
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
  },
];
