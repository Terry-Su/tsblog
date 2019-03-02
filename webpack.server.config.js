const path = require( 'path' )

const build = path.resolve( __dirname, 'dist' )

module.exports = {
  mode  : "production",
  entry : path.resolve( __dirname, 'src/index' ),
  output: {
    path         : build,
    filename     : 'tsblog.js',
    libraryTarget: 'commonjs'
  },
  module: {
    rules: [
      {
        test   : /\.ts*?/,
        loader : "ts-loader",
        exclude: /node_modules/,
      },
      {
        test   : /\.js$/,
        use    : [ 'babel-loader' ],
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: [ ".ts", ".tsx", ".js" ]
  },
  devtool: "inline-source-map",
}