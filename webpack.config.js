var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var jsName = 'bundle.js';

var BUILD_DIR = path.resolve(__dirname, 'assets');

var config = {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'client.jsx')
  ],
  output: {
      path: BUILD_DIR,
      filename: 'bundle.js',
      publicPath: '/assets/',
      chunkFilename: '[name].bundle.js'
  },
  resolve: {
      extensions: ['.js', '.jsx', '.css']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
         loader: ExtractTextPlugin.extract({
              loader: 'css-loader',
              query: {
                modules: false
              }
            })
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(gif|png)$/,
        loader: 'file-loader'
      }
    ]
  },
  node: {
   fs: "empty"
  },
 plugins: [
   new ExtractTextPlugin({
     filename: 'styles.css',
     allChunks: true
   })
 ]
};

module.exports = config;
