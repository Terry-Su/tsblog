import CleanWebpackPlugin from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWeabpckPlugin from 'html-webpack-plugin'
import path from 'path'
import { ReactLoadablePlugin } from 'react-loadable/webpack'
import UglifyjsWebpackPlugin from 'uglifyjs-webpack-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import WriteFilePlugin from 'write-file-webpack-plugin'

import { __DEV__ } from '../global'
import {
    PATH_CACHE_ENTRY_COMPONENT, PATH_PUBLIC, PATH_PUBLIC_LOADABLE, PATH_WEBPACK_TSCONFIG
} from '../paths'
import { Config } from '../typings'

export default ( { entry }: Config ) => ( {
  mode  : __DEV__ ? "development" : "production",
  entry : PATH_CACHE_ENTRY_COMPONENT,
  output: {
    filename     : "bundle.js",
    chunkFilename: "[name].js",
    path         : PATH_PUBLIC,
    publicPath   : `/`
  },
  module: {
    rules: [
      {
        test: /\.ts*?/,
        use : [
          {
            loader : "ts-loader",
            options: {
              transpileOnly: true,
              configFile   : entry.tsconfigPath || PATH_WEBPACK_TSCONFIG,
              // happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            }
          }
        ],
        exclude: /node_modules/,
        
      },
      {
        test: /\.(js|jsx)$/,
        use : [
          { loader: 'cache-loader', },
          {
            loader : "babel-loader",
            options: {
              presets: [ "@babel/preset-env", "@babel/preset-react" ],
              plugins: [ "@babel/plugin-proposal-class-properties" ]
            },
          },
        ],
        exclude: /node_modules/
      },
      //  {
      //   test: /\.html$/,
      //   use : [
      //     {
      //       loader: 'raw-loader'
      //     }
      //   ]
      // }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".tsx", ".js", ".jsx" ]
    // modules   : [
    // PATH_NODE_MODULES,
    // 'node_modules',
    // ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin( {
      tsconfig: entry.tsconfigPath || PATH_WEBPACK_TSCONFIG,
    } ),
    // new webpack.HotModuleReplacementPlugin(),
    new ReactLoadablePlugin( {
      filename: PATH_PUBLIC_LOADABLE
    } ),
    new WriteFilePlugin(),
    new CopyPlugin( [
      ...(
        entry.static != null ? [ {
          from: entry.static,
          to  : PATH_PUBLIC
        } ] : [] 
      )
    ] ),
    ...(
      __DEV__ ? [
      ] : [
        new webpack.DefinePlugin( {
          "process.env.NODE_ENV": JSON.stringify( "production" )
        } ),
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
      ]
    )
  ],
  ...( __DEV__ ? {
    devtool: "inline-source-map"
  } : {} ),
  externals: {
    ...( __DEV__ ? {
    } : {
      // react              : 'React',
      // 'react-dom'        : 'ReactDOM',
      // 'styled-components': 'styled',
      // '@babel/standalone': 'Babel',
    } )
  }
} )
