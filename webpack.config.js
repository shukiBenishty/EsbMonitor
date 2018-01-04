var path = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'assets');

var config = {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'client.jsx')
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', 'css']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    },
    ]
  },
  node: {
    fs: "empty"
  }
};

module.exports = config;
