import fs from 'fs-extra'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
// import Loadable from 'react-loadable'
import { getBundles } from 'react-loadable/webpack'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'

import { isDev } from '../constants/global'
import { NAME_GV_CURRENT_PAGE } from '../constants/names'
import {
    PATH_CACHE_APP_COMPONENT, PATH_PUBLIC, PATH_PUBLIC_LOADABLE, PATH_PUBLIC_LOADABLE2,
    PATH_TARGET_REACT_LOADABLE
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
    const Loadable = require( PATH_TARGET_REACT_LOADABLE )
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

      const sheet = new ServerStyleSheet()

      const appHtml = ReactDOMServer.renderToString(
        sheet.collectStyles(<StaticRouter location={path} context={{}}>
          <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            <App />
          </Loadable.Capture>
        </StaticRouter>)
      )
      const style = sheet.getStyleTags()

      
      const bundles = getBundles(stats, modules)
      let files: string[] = bundles.map(({ file }) => file)
      files = files.filter((file, index) => files.indexOf(file) === index)

      const text = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>App</title>
    ${globalScript}
    ${style}
  </head>
  <body>
    <div id="root">${ isDev ? '' : appHtml}</div>
    ${files
      .map(file => {
        return `<script src="/${file}"></script>`
      })
      .join("\n")}
  <script type="text/javascript" src="/bundle.js"></script></body>
</html>`

      fs.outputFileSync(targetPath, text)
    })
  })
}