import * as fs from 'fs-extra'
import * as path from 'path'

import buildAppComponent from './deploy/buildAppComponent'
import buildEntryComponentFile from './deploy/buildEntryComponentFile'
import buildIndexHtmls from './deploy/buildIndexHtmls'
import buildPageDatas from './deploy/buildPageDatas'
import { server } from './deploy/server'
import { PATH_APP_COMPONENT, PATH_CACHE, PATH_CACHE_ENTRY_COMPONENT } from './paths'
import { Config, SourcedData, TransformedData, TypeRoute } from './typings'

const PATH = path
export function deploy( transformedData: TransformedData, config: Config ) {
  const { remarks, yamls } = transformedData
  const { getPages, home } = config.entry
  // ## run 'get pages'
  const pages = getPages( transformedData ) || []


  // # (Got in config)get home page component

  // # create routes
  const routes: TypeRoute[] = pages.map( ( { path, component, data } ) => ( {
    path,
    exact        : true,
    componentName: PATH.basename( component ).replace(
      new RegExp( `${PATH.extname( component )}$` ),
      ""
    ),
    componentRelativePath: PATH.relative( PATH_CACHE, component ),
    componentAbsolutePath: component
  } ) )

  // # build Entry component file
  buildAppComponent( routes )
  buildEntryComponentFile( routes )

  // # server
  server( config ).then( () => {
    // # create static files based on pageInfos
    buildPageDatas( transformedData, config, pages )
    buildIndexHtmls( transformedData, config, pages, routes )
  } )
}
