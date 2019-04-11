import CopyPlugin from 'copy-webpack-plugin'
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
        test   : /\.ts*?/,
        loader : "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: entry.tsconfigPath || PATH_WEBPACK_TSCONFIG
        }
      },
      {
        test: /\.(js|jsx)$/,
        use : {
          loader : "babel-loader",
          options: {
            presets: [ "@babel/preset-env", "@babel/preset-react" ],
            plugins: [ "@babel/plugin-proposal-class-properties" ]
          },
        },
        exclude: /node_modules/
      }
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
      ]
    )
  ],
  ...( __DEV__ ? {
    devtool: "inline-source-map"
  } : {} ),
  externals: {
    ...( __DEV__ ? {
      '@babel/standalone': 'Babel',
    } : {
      react              : 'React',
      'react-dom'        : 'ReactDOM',
      'styled-components': 'styled',
      '@babel/standalone': 'Babel',
    } )
  }
  // optimization: {
  //   minimize : true,
  //   minimizer: [
  //     new UglifyjsWebpackPlugin( {
  //       // chunkFilter: ( chunk ) => {
  //       //   // Exclude uglification for the `vendor` chunk
  //       //   if ( chunk.name.startsWith( 'vendor' ) ) {
  //       //     return false
  //       //   }
          
  //       //   return true
  //       // }
  //     } )
  //   ],
  //   splitChunks: {
  //     chunks                : 'async',
  //     minSize               : 30000,
  //     maxSize               : 0,
  //     minChunks             : 1,
  //     maxAsyncRequests      : 5,
  //     maxInitialRequests    : 3,
  //     automaticNameDelimiter: '~',
  //     name                  : true,
  //     cacheGroups           : {
  //       vendors: {
  //         test    : /[\\/]node_modules[\\/]/,
  //         priority: -10
  //       },
  //       default: {
  //         minChunks         : 2,
  //         priority          : -20,
  //         reuseExistingChunk: true
  //       }
  //     }
  //   }
  // }
} )
