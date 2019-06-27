import path from 'path'

import { PageInfo, TransformedData } from '../../src/typings'

const { resolve } = path

export default {
  siteData: {
    title: "TSBLOG"
  },
  entry: {
    title       : "Site's Title",
    contents    : resolve( __dirname, "./contents" ),
    home        : resolve( __dirname, "./src/pages/Home" ),
    // static      : resolve( __dirname, "./static" ),
    getPages,
    dotDirectory: false,
    watching    : [ resolve( __dirname, "testWatching/testWatching.js" ) ],
    setWebpack  : webpackConfig => {
      webpackConfig.module.rules = [
        ...webpackConfig.module.rules,
      ],
      webpackConfig.resolve = {
        alias: {
          '@'   : resolve( __dirname, './src/' ),
          '@src': resolve( __dirname, '../../src' ),
        },
        extensions: [ ".tsx", ".ts", ".js" ],
      }
    },
    tsconfigPath: resolve( __dirname, "tsconfig.json" )
  },

  port: 3602
}

function getPages( transformedData: TransformedData ): PageInfo[] {
  const { remarks, siteData } = transformedData

  const homePageInfo = {
    path     : "/",
    component: resolve( __dirname, "./src/pages/Home" ),
    data     : {
      siteData
    }
  }
  const remarkPageInfos = remarks.map(
    ( { relativePath, getMetadata, getText } ) => ( {
      path     : `/${relativePath}`,
      component: resolve( __dirname, "./src/template/RemarkTemplate" ),
      data     : {
        text    : getText(),
        metadata: getMetadata()
      }
    } )
  )
  return [ homePageInfo, ...remarkPageInfos ]
}
