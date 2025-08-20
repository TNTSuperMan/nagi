const HTMLWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");

const views = fs.readdirSync("./frontend/views");

const entry = {};
views.forEach(view => {
    entry[view] = "./frontend/views/" + view + "/index.jsx";
});

module.exports = [
    {
        name: "frontend",
        target: "web",
        mode: process.env.NODE_ENV === "production" ? "production" : "development",
        entry: entry,
        output: {
            path: __dirname + "/frontend/dist",
            filename: "[name].js"
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
    },
    {
        name: "backend",
        target: "node",
        mode: process.env.NODE_ENV === "production" ? "production" : "development",
        entry: "./backend/index.js",
        output: {
            path: __dirname + "/dist",
            filename: "server.js"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: "babel-loader",
                    exclude: /node_modules/
                }
            ]
        }
    }
]
