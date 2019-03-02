import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

import { PATH_PUBLIC } from '../paths'
import { Config } from '../typings'
import webpackConfig from './webpack.config'

const app = express()

export function server( config: Config ) {
  const { port = 8080, entry } = config
  const { setWebpack } = entry

  const options = {
    contentBase: PATH_PUBLIC,
    hot        : false,
    host       : "localhost"
  }

  return Promise.resolve(
    new Promise( resolve => {
      if ( setWebpack ) { setWebpack( webpackConfig ) }
      webpackDevServer.addDevServerEntrypoints( webpackConfig, options )
      const compiler = webpack( webpackConfig )
      
      compiler.hooks.done.tap( 'tsblog', resolve )

      const server = new webpackDevServer( compiler, options )
      server.listen( port, "localhost", () => {
        console.log( `dev server listening on port ${port}` )
      } )
    } )
  )
}
