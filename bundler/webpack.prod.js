const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        plugins:
        [
          new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html'),
            minify: true
          }),
          new HtmlWebpackPlugin({
              filename: 'about.html',
              template: path.resolve(__dirname, '../src/about.html'),
              minify: true
          }),
          new CleanWebpackPlugin()
        ]
    }
)
