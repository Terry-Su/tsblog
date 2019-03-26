import path from 'path'

import { PageInfo, TransformedData } from '../../typings'

const { resolve } = path

export default {
  siteData: {
    title: 'TSBLOG'
  },
  entry: {
    title       : "Site's Title",
    contents    : resolve( __dirname, "./contents" ),
    home        : resolve( __dirname, "./src/pages/Home" ),
    getPages,
    dotDirectory: false,
    watching    : [ resolve( __dirname, "testWatching/testWatching.js" ) ]
  },

  port: 3601
}

function getPages( transformedData: TransformedData ): PageInfo[] {
  const { remarks, siteData } = transformedData

  const homePageInfo = {
    path     : '/',
    component: resolve( __dirname, "./src/pages/Home" ),
    data     : {
      siteData
    }
  }
  const remarkPageInfos = remarks.map( ( { relativePath, getMetadata, getText } ) => ( {
    path     : `/${ relativePath }`,
    component: resolve( __dirname, "./src/template/RemarkTemplate" ),
    data     : {
      text    : getText(),
      metadata: getMetadata()
    }
  } ) )
  return [
    homePageInfo,
    ...remarkPageInfos,
  ]

}
