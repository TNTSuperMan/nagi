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
    mode: "production",
    entry: entry,
    output: {
        path: __dirname + "/frontend/dist",
        filename: "[name].js"
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "./frontend/dist")
        },
        port: 3000,
        hot: true,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        ...views.map(view => new HTMLWebpackPlugin({
            template: "./frontend/template.html",
            filename: view + ".html",
            chunks: [view]
        }))
    ]
}
