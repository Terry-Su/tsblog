import path from 'path'

import { PageInfo, TransformedData } from './src/typings'

const { resolve } = path

export default {
  siteData: {
    title: 'TSBLOG'
  },
  entry: {
    contents: resolve( __dirname, "./contents" ),
    home    : resolve( __dirname, "./src/pages/Home" ),
    getPages
  }
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
  const remarkPageInfos = remarks.map( ( { relativePath, metadata, text } ) => ( {
    path     : `/${ relativePath }`,
    component: resolve( __dirname, "./src/template/RemarkTemplate" ),
    data     : {
      text,
      metadata
    }
  } ) )
  return [
    homePageInfo,
    ...remarkPageInfos,
  ]

}
