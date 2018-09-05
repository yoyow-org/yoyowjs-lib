var path = require("path");
let webpack = require('webpack');

module.exports = function (env) {
    return {
        entry: [env.php ? "./dist/php.js" : "./dist/index.js"],
        output: {
            path: path.join(__dirname, "./build"),
            filename: env.php ? "yoyow-php-sdk.js" : "yoyow-node-sdk.js",
            libraryTarget: "commonjs",
            library: "yoyowSDK"
        },
        externals: {
            ws: "ws",
            ReconnectingWebSocket: "ReconnectingWebSocket"
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                output: {comments: false},
                compress: {warnings: false}
            })
        ]
    };
}