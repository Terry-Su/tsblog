import chokidar from 'chokidar'
import * as fs from 'fs-extra'
import glob from 'glob'
import * as path from 'path'

import buildAppComponent from './deploy/buildAppComponent'
import buildEntryComponentFile from './deploy/buildEntryComponentFile'
import buildIndexHtmls from './deploy/buildIndexHtmls'
import buildPageDatas from './deploy/buildPageDatas'
import buildTSLinkComponent from './deploy/buildTSLinkComponent'
import { server } from './deploy/server'
import { PATH_APP_COMPONENT, PATH_CACHE, PATH_CACHE_ENTRY_COMPONENT } from './paths'
import { Config, SourcedData, TransformedData, TypeRoute } from './typings'

const PATH = path
export async function deploy( getTransformedData: Function, config: Config ) {
  const transformedData: TransformedData = await getTransformedData()

  const buildBasis = transformedData => {
    const { getPages } = config.entry

    // ## run 'get pages'
    const pages = getPages( transformedData ) || []

    // # (Got in config)get home page component

    // # create routes
    const routes: TypeRoute[] = pages.map( ( { path, component, data = {} } ) => ( {
      path         : `${path}`,
      exact        : true,
      componentName: PATH.basename( component ).replace(
        new RegExp( `${PATH.extname( component )}$` ),
        ""
      ),
      componentRelativePath: PATH.relative( PATH_CACHE, component ),
      componentAbsolutePath: component
    } ) )

    // # build Entry component file
    buildTSLinkComponent( routes, config )
    buildAppComponent( routes )
    buildEntryComponentFile( routes, config )

    return {
      pages,
      routes
    }
  }

  const buildAfterServer = ( { pages, routes } ) => {
    // # create static files based on pageInfos
    buildPageDatas( transformedData, config, pages )
    buildIndexHtmls( transformedData, config, pages, routes )
  }

  const { pages, routes } = buildBasis( transformedData )

  // # server
  server( config ).then( () => {
    buildAfterServer( {
      pages,
      routes
    } )
  } )

  // # watch contents
  const { contents, watching = [] } = config.entry
  const contentsFiles = glob.sync( `${contents}/**/*` )
  const watchingFiles = [ ...contentsFiles, ...watching ]
  chokidar.watch( watchingFiles ).on( "change", async () => {
    // console.log( "contents changed" )
    // # re-generate website data
    const transformedData: TransformedData = await getTransformedData()
    const { pages, routes } = buildBasis( transformedData )
    buildPageDatas( transformedData, config, pages )
    buildIndexHtmls( transformedData, config, pages, routes )
  } )
}
