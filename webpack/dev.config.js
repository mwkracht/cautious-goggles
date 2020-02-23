const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const host = 'localhost';
const port = 3000;
const customPath = path.join(__dirname, './customPublicPath');

module.exports = (env, argv) => {
  return {
    entry: {
      foe_tools: [customPath, path.join(__dirname, '../chrome/extension/foe_tools')],
      background: [customPath, path.join(__dirname, '../chrome/extension/background')],
    },
    output: {
      path: path.join(__dirname, '../dev'),
      filename: 'js/[name].bundle.js',
      chunkFilename: 'js/[id].chunk.js'
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
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
      ]),
      new webpack.DefinePlugin({
        __HOST__: `'${host}'`,
        __PORT__: port
      })
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
        ],
        exclude: /node_modules/
      }, {
          test: /\.pug$/,
          use: 'pug-loader'
      }]
    }
  }
};
