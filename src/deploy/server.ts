import browserSync from 'browser-sync'
import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

import { __DEV__ } from '../global'
import { PATH_PUBLIC } from '../paths'
import { Config } from '../typings'
import getWebpackConfig from './webpack.config'

export function server( config: Config ) {
  const { port = 8080, entry } = config
  const { setWebpack } = entry

  const options = {
    contentBase: PATH_PUBLIC,
    hot        : false,
    host       : "localhost"
  }

  const webpackConfig = getWebpackConfig( config )
  return Promise.resolve(
    new Promise( resolve => {
      if ( setWebpack ) {
        setWebpack( webpackConfig )
      }

      if ( __DEV__ ) {
        webpackDevServer.addDevServerEntrypoints( webpackConfig, options )
        const compiler = webpack( webpackConfig )

        compiler.hooks.done.tap( "tsblog", resolve )

        const server = new webpackDevServer( compiler, options )
        server.listen( port, "localhost", () => {
          console.log( `dev server: http://localhost:${port}` )
        } )
      }
      if ( ! __DEV__ ) {
        const compiler = webpack( webpackConfig )
        compiler.hooks.done.tap( "tsblog", resolve )
        compiler.watch( {}, ( err, stats ) => {
          if ( err ) {
            console.error( err )
            return
          }
    
          console.log(
            stats.toString( {
              chunks: false,
              colors: true
            } )
          )
        } )

        browserSync.init( {
          server: PATH_PUBLIC,
          port,
          open  : false,
        } )
      }
    } )
  )
}
