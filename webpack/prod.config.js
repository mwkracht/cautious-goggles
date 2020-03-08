const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const customPath = path.join(__dirname, './customPublicPath');

module.exports = (env, argv) => {
  return {
    entry: {
      foe_tools: [customPath, path.join(__dirname, '../chrome/extension/foe_tools')],
      background: [customPath, path.join(__dirname, '../chrome/extension/background')],
    },
    output: {
      path: path.join(__dirname, '../build'),
      filename: 'js/[name].bundle.js',
      chunkFilename: 'js/[id].chunk.js'
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
      new HTMLWebpackPlugin({
        template: 'chrome/views/popup.pug',
        filename: 'popup.html',
        inject: false,
        mode: argv.mode
      }),
      new CopyPlugin([
        { from: 'chrome/manifest.json', to: '.'},
        { from: 'chrome/assets', to: '.' },
        { from: 'chrome/extension/listener', to: 'js/listener' }
      ])
    ],
    resolve: {
      extensions: ['*', '.js']
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }, {
          test: /\.pug$/,
          use: 'pug-loader'
      }]
    }
  }
};
