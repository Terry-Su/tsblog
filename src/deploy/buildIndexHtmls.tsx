import fs from 'fs-extra'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Loadable from 'react-loadable'
import { getBundles } from 'react-loadable/webpack'
import { StaticRouter } from 'react-router-dom'

import { ChunkExtractor } from '@loadable/server'

import { NAME_GV_CURRENT_PAGE } from '../constants/names'
import {
    PATH_CACHE_APP_COMPONENT, PATH_PUBLIC, PATH_PUBLIC_LOADABLE, PATH_PUBLIC_LOADABLE2
} from '../paths'
import { Config, PageInfo, TransformedData, TypeRoute } from '../typings'

const { resolve } = path

export default function buildIndexHtmls(
  transformedData: TransformedData,
  config: Config,
  pages: PageInfo[],
  routes: TypeRoute[]
) {
  pages.map(({ path, data }) => {
    const targetPath = resolve(PATH_PUBLIC, `.${path}/index.html`)
    const globalScript = `
<script>
window.${NAME_GV_CURRENT_PAGE}={
  path: '${path}',
  data: ${JSON.stringify(data)}
}
</script>
`
    // ssr
    // import App including loadable components
    const App = require(PATH_CACHE_APP_COMPONENT).default

    // preload all loadable components first
    Loadable.preloadAll().then(() => {
      let modules = []
      const stats = require(PATH_PUBLIC_LOADABLE)

      // set window variable
      global["window"] = {
        [NAME_GV_CURRENT_PAGE]: {
          path,
          data
        }
      }

      const appHtml = ReactDOMServer.renderToString(
        <StaticRouter location={path} context={{}}>
          <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            <App />
          </Loadable.Capture>
        </StaticRouter>
      )

      const bundles = getBundles(stats, modules)
      let files: string[] = bundles.map( ({file}) => file )
      files = files.filter( ( file, index ) => files.indexOf( file ) === index )
      
      const text = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>App</title>
    ${globalScript}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    ${files
      .map(file => {
        // console.log(bundle.file)
        return `<script src="/${file}"></script>`
        // alternatively if you are using publicPath option in webpack config
        // you can use the publicPath value from bundle, e.g:
        // return `<script src="${bundle.publicPath}"></script>`
      })
      .join("\n")}
  <script type="text/javascript" src="/bundle.js"></script></body>
</html>`

      fs.outputFileSync(targetPath, text)
    })
  })
}
