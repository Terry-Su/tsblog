import fs from 'fs-extra'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
// import Loadable from 'react-loadable'
import { getBundles } from 'react-loadable/webpack'
import { StaticRouter } from 'react-router-dom'
import serializeJavascript from 'serialize-javascript'

import { NAME_GV_CURRENT_PAGE } from '../constants/names'
import { __DEV__ } from '../global'
import {
    PATH_CACHE_APP_COMPONENT, PATH_PUBLIC, PATH_PUBLIC_LOADABLE, PATH_TARGET_REACT_LOADABLE,
    PATH_TARGET_REACT_REDUX, PATH_TARGET_REDUX, PATH_TARGET_STYLED_COMPONENTS
} from '../paths'
import { Config, PageInfo, TransformedData, TypeRoute } from '../typings'

const { resolve } = path

export default async function buildIndexHtmls(
  transformedData: TransformedData,
  config: Config,
  pages: PageInfo[],
  routes: TypeRoute[]
) {
  for (const { path, data = {} } of pages) {
    // pages.map(({ path, data }) => {
    const targetPath = resolve(PATH_PUBLIC, `.${path}/index.html`)
    const { siteTitle = '' } = data
    const windowData = {
      [NAME_GV_CURRENT_PAGE]: {
        path,
        data
      }
    }
    const globalScript = `
<script>
${Object.keys(windowData).map(
  key =>
    `
window.${key}=${serializeJavascript(windowData[key], { unsafe: true })}
`
)}
</script>
`
    // ssr
    // import App including loadable components
    // set window variables
    global["window"] = windowData
    global["document"] = {
      body: {
        getBoundingClientRect: () => ({})
      }
    }
    global["location"] = {
      pathname: path
    }

    const { reduxApp, title,  } = config.entry
    const useRedux = !!reduxApp
    const reducer = useRedux ? require(reduxApp).default : {}

    const App = require(PATH_CACHE_APP_COMPONENT).default
    const Loadable = require(PATH_TARGET_REACT_LOADABLE)
    const { ServerStyleSheet } = require(PATH_TARGET_STYLED_COMPONENTS)
    const { createStore } = require(PATH_TARGET_REDUX)
    const { Provider } = require(PATH_TARGET_REACT_REDUX)
    // preload all loadable components first
    await Loadable.preloadAll().then(() => {
      let modules = []
      const stats = require(PATH_PUBLIC_LOADABLE)

      const sheet = new ServerStyleSheet()

      const main = (
        <StaticRouter location={path} context={{}}>
          <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            <App />
          </Loadable.Capture>
        </StaticRouter>
      )

      const appHtml = __DEV__
        ? ""
        : ReactDOMServer.renderToString(
            sheet.collectStyles(
              useRedux ? (
                <Provider store={createStore(reducer)}>{main}</Provider>
              ) : (
                main
              )
            )
          )
      const style = sheet.getStyleTags()
      const globalStyle = `<style>
html,body,#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
      </style>`

      const bundles = getBundles(stats, modules)
      let files: string[] = bundles.map(({ file }) => file)
      files = files.filter((file, index) => files.indexOf(file) === index)

      const text = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>${title != null ? title : siteTitle}</title>
    ${globalScript}
    ${globalStyle}
    ${style}
  </head>
  <body>
    <div id="root">${__DEV__ ? "" : appHtml}</div>
    ${files
      .map(file => {
        return `<script src="/${file}"></script>`
      })
      .join("\n")}
  <script type="text/javascript" src="/bundle.js"></script></body>
</html>`

      fs.outputFileSync(targetPath, text)
    })
  }
  // })
}
