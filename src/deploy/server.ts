import browserSync from 'browser-sync'
import express from 'express'
import fs from 'fs'
import path from 'path'
import trash from 'trash'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

import { __DEV__ } from '../global'
import { PATH_PUBLIC } from '../paths'
import { Config } from '../typings'
import getWebpackConfig from './webpack.config'

export function server( config: Config ) {
  const { port = 8080, entry } = config
  const { setWebpack } = entry



  const webpackConfig = getWebpackConfig( config )
  return Promise.resolve(
    new Promise( resolve => {
      if ( setWebpack ) {
        setWebpack( webpackConfig )
      }

      if ( __DEV__ ) {
        const { devServer = {} } = ( <any>webpackConfig )
        const contentBase = [
          PATH_PUBLIC,
          ...( devServer.contentBase || [] )
        ]
        const options = {
          contentBase,
          // hot : true,
          host: "localhost"
        }
        webpackDevServer.addDevServerEntrypoints( webpackConfig, options )
        const compiler = webpack( webpackConfig )

        compiler.hooks.done.tap( "tsblog", resolve )

        const server = new webpackDevServer( compiler, options )
        server.listen( port, "localhost", () => {
          console.log( `dev server: http://localhost:${port}` )
        } )
      }
      if ( !__DEV__ ) {
        if ( fs.existsSync( PATH_PUBLIC ) ) {
          trash( PATH_PUBLIC ).then( () => buildingWork() )
        } else {
          buildingWork()
        }
      }
      function buildingWork() {
        const compiler = webpack( webpackConfig )
        compiler.hooks.done.tap( "tsblog", resolve )
        compiler.run( ( err, stats ) => {
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

        // browserSync.init( {
        //   server: PATH_PUBLIC,
        //   port,
        //   open  : false,
        // } )
      }
    } )
  )
}
