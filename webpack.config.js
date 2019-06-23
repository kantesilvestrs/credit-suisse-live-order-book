const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "live-order-book.js",
    path: path.resolve(__dirname, "build"),
    library: "liveOrderBook",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".ts"]
  },
  optimization: {
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/env",
                  {
                    modules: false,
                    targets: {
                      node: "current"
                    }
                  }
                ],
                "@babel/typescript"
              ],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "babel-plugin-ts-nameof"
              ]
            }
          }
        ]
      }
    ]
  }
};
