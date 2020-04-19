const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal
    ? 'cheap-module-eval-source-map'
    : 'source-map',
  resolve: {
    extensions: ['.json', '.ts'],
    symlinks: false,
    cacheWithContext: false
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true
        }
      }
    ]
  }
}
