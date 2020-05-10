const path = require("path");
const pkg = require("./package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const buildPath = "./build/";

module.exports = {
  entry: ["./src/app.js"],
  output: {
    path: path.join(__dirname, buildPath),
    filename: "[name].[hash].js",
    publicPath: `/${pkg.repository}/`
  },
  target: "web",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: path.resolve(__dirname, "./node_modules/")
      },
      {
        test: /\.(jpe?g|png|gif|svg|tga|gltf|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|ogg)$/i,
        use: "file-loader",
        exclude: path.resolve(__dirname, "./node_modules/")
      },
      {
        test: /\.(vert|frag|glsl|shader|txt)$/i,
        use: "raw-loader",
        exclude: path.resolve(__dirname, "./node_modules/")
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    alias: {
      lights$: path.resolve(__dirname, "src/components/lights"),
      objects$: path.resolve(__dirname, "src/components/objects"),
      scenes$: path.resolve(__dirname, "src/components/scenes"),
      tracker$: path.resolve(__dirname, "src/components/tracker"),
      positioning$: path.resolve(__dirname, "src/components/positioning"),
      interface$: path.resolve(__dirname, "src/components/interface")
    }
  },
  plugins: [
    // new HtmlWebpackPlugin({ title: pkg.title, favicon: 'src/favicon.ico' }),
    new HtmlWebpackPlugin({
      title: pkg.title,
      template: "src/index.html",
      favicon: "src/favicon.ico"
    })
  ]
};
