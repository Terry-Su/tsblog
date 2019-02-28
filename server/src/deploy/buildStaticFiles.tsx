import fs from 'fs-extra'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Loadable from 'react-loadable'
import { getBundles } from 'react-loadable/webpack'
import { matchPath, StaticRouter } from 'react-router-dom'

import Template from '../browser/components/__template__'
import { NAME_GV_CURRENT_PAGE } from '../constants/names'
import {
    PATH_CACHE_ENTRY_COMPONENT, PATH_PUBLIC, PATH_PUBLIC_INDEX_HTML, PATH_PUBLIC_LOADABLE,
    PATH_PUBLIC_PAGE_DATA
} from '../paths'
import { Config, PageInfo, TransformedData, TypeRoute } from '../typings'
import createFileNameOfPath from '../utils/createFileNameOfPath'

const { resolve } = path

export default function buildStaticFiles(
  transformedData: TransformedData,
  config: Config,
  routes: TypeRoute[]
) {
  // # remarks data(json)
  // # 123
}

export function buildIndexHtmls(
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
    const { App } = require( PATH_CACHE_ENTRY_COMPONENT )
    console.log( { App } )
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

export function buildPageDatas(
  transformedData: TransformedData,
  config: Config,
  pages: PageInfo[]
) {
  pages.map(({ path, data }) => {
    const targetPath = resolve(
      PATH_PUBLIC_PAGE_DATA,
      `${createFileNameOfPath(path)}.json`
    )
    fs.outputJSONSync(targetPath, data)
  })
}
