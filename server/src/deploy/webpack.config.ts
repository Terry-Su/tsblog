import path from 'path'
import { ReactLoadablePlugin } from 'react-loadable/webpack'
import webpack from 'webpack'
import WriteFilePlugin from 'write-file-webpack-plugin'

import {
    PATH_CACHE_ENTRY_COMPONENT, PATH_INDEX_HTML, PATH_PUBLIC, PATH_PUBLIC_LOADABLE,
    PATH_WEBPACK_TSCONFIG
} from '../paths'

const HtmlWebpackPlugin = require( "html-webpack-plugin" )

export default {
  mode  : "development",
  // mode  : 'production',
  entry : PATH_CACHE_ENTRY_COMPONENT,
  // [
  //   // 'webpack-hot-middleware/client',
  //   PATH_CACHE_ENTRY_COMPONENT,
  // ],
  output: {
    filename     : "bundle.js",
    chunkFilename: "[name].js",
    path         : PATH_PUBLIC,
    publicPath   : `/`
  },
  module: {
    rules: [
      {
        test   : /\.ts*?/,
        loader : "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: PATH_WEBPACK_TSCONFIG
        }
      },
      {
        test: /\.(js|jsx)$/,
        use : {
          loader : "babel-loader",
          options: {
            presets: [ "@babel/preset-env", "@babel/preset-react" ],
            plugins: [ "@babel/plugin-proposal-class-properties" ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".tsx", ".js", ".jsx" ]
  },
  plugins: [
    // new HtmlWebpackPlugin( {
    //   title   : 'App',
    //   // Load a custom template (lodash by default)
    //   template: PATH_INDEX_HTML
    // } )
    // new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin(),
    new ReactLoadablePlugin( {
      filename: PATH_PUBLIC_LOADABLE
    } ),
  ],
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // },
  devtool: "inline-source-map"
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       default: false,
  //       vendors: false
  //     }
  //   }
  // }
}
