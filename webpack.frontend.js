const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");

const views = fs.readdirSync("./frontend/views");

const entry = {};
views.forEach(view => {
  entry[view] = "./frontend/views/" + view + "/index.jsx";
});

module.exports = {
  name: "frontend",
  target: "web",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: entry,
  output: {
    path: __dirname + "/frontend/dist",
    filename: "[name].js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "./frontend/dist"),
    },
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:5103",
        secure: false,
      },
    ],
    port: 3000,
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    ...views.map(view => new HTMLWebpackPlugin({
      template: "./frontend/template.html",
      filename: view + ".html",
      chunks: [view],
    })),
  ],
};
