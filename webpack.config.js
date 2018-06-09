var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    }, {
      test: /\.json?$/,
      exclude: /node_modules/,
      loader: 'json'
    }, {
      test: /\.css$/,
      loader: 'style!css!autoprefixer?browsers=last 2 versions'
    }, {
      test: /\.html$/,
      loader: 'file?name=[name].[ext]'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './build',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

