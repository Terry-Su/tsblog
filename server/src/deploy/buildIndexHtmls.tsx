import fs from 'fs-extra'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Loadable from 'react-loadable'
import { getBundles } from 'react-loadable/webpack'
import { StaticRouter } from 'react-router-dom'

import { NAME_GV_CURRENT_PAGE } from '../constants/names'
import { PATH_CACHE_APP_COMPONENT, PATH_PUBLIC, PATH_PUBLIC_LOADABLE } from '../paths'
import { Config, PageInfo, TransformedData, TypeRoute } from '../typings'

const { resolve } = path

export default function buildIndexHtmls(
  transformedData: TransformedData,
  config: Config,
  pages: PageInfo[],
  routes: TypeRoute[]
) {
  pages.map(({ path, data }) => {
    global["window"] = {
      [NAME_GV_CURRENT_PAGE]: {
        path,
        data
      }
    }

    const targetPath = resolve(PATH_PUBLIC, `.${path}/index.html`)
    const script = `
<script>
window.${NAME_GV_CURRENT_PAGE}={
  path: '${path}',
  data: ${JSON.stringify(data)}
}
</script>
`
    // ssr
    let modules = []
    const stats = require(PATH_PUBLIC_LOADABLE)
    const App = require( PATH_CACHE_APP_COMPONENT ).default
    const appHtml = 
      ReactDOMServer.renderToString(
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <StaticRouter location={path} context={{}}>
            <App/>
          </StaticRouter>
        </Loadable.Capture>
      )

    let bundles = getBundles(stats, modules)
    console.log(bundles)

    const text = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>App</title>
    ${script}
  </head>
  <body>
    <div id="root">${appHtml}</div>
  <script type="text/javascript" src="/bundle.js"></script></body>
</html>`

    fs.outputFileSync(targetPath, text)
  })
}