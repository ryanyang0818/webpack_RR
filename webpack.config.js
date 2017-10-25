const path = require('path');
const webpack = require('webpack');

module.exports = [
{
  entry: {
    app: ['./entry.js'],
  },
  output: {
    path: __dirname,
    filename: './bundle.js'
  },  
  module: {

    loaders: [
      {test: /\.css$/,  loader: 'style-loader!css-loader'},
      {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'}
    ]
  },
  
  plugins: [
    new webpack.BannerPlugin('This file is created by zhaoda'),
    // new webpack.optimize.UglifyJsPlugin()
  ]
  
}

]