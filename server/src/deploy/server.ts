import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

import { PATH_PUBLIC } from '../paths'
import webpackConfig from './webpack.config'

const app = express()

export function server( ) {
  const PORT = 3600

  const options = {
    contentBase: PATH_PUBLIC,
    hot        : false,
    host       : 'localhost'
  }

  
  webpackDevServer.addDevServerEntrypoints( webpackConfig, options )
  const compiler = webpack( webpackConfig )
  const server = new webpackDevServer( compiler, options )

  server.listen( PORT, 'localhost', () => {
    console.log( `dev server listening on port ${PORT}` )
  } )
}
