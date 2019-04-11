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
    const targetPath = resolve(PATH_PUBLIC, `.${path}/index.html`)
    const { siteTitle = "", siteMetaDescription = "" } = data
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

    const { reduxApp, title } = config.entry
    const Loadable = require(PATH_TARGET_REACT_LOADABLE)

    let App
    let ServerStyleSheet
    let useRedux
    let Provider
    let createStore
    let reducer
    if (!__DEV__) {
      useRedux = !!reduxApp
      reducer = useRedux ? require(reduxApp).default : {}
      App = require(PATH_CACHE_APP_COMPONENT).default
      ServerStyleSheet = require(PATH_TARGET_STYLED_COMPONENTS).ServerStyleSheet
      createStore = require(PATH_TARGET_REDUX).createStore
      Provider = require(PATH_TARGET_REACT_REDUX).Provider
    }

    // preload all loadable components first
    await Loadable.preloadAll().then(() => {
      let modules = []
      const stats = require(PATH_PUBLIC_LOADABLE)
      let appHtml = ""
      let style = ""

      if (!__DEV__) {
        const sheet = new ServerStyleSheet()

        const main = (
          <StaticRouter location={path} context={{}}>
            <Loadable.Capture report={moduleName => modules.push(moduleName)}>
              <App />
            </Loadable.Capture>
          </StaticRouter>
        )

        appHtml = ReactDOMServer.renderToString(
          sheet.collectStyles(
            useRedux ? (
              <Provider store={createStore(reducer)}>{main}</Provider>
            ) : (
              main
            )
          )
        )
        style = sheet.getStyleTags()
      }

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
    <meta charset="UTF-8">
    <meta name="description" content="${siteMetaDescription}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title != null ? title : siteTitle}</title>
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
  ${globalScript}
  ${
    __DEV__ ?  `
    <script src="https://unpkg.com/@babel/standalone@7.4.3/babel.min.js"></script>
    ` : `
    <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/styled-components/dist/styled-components.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone@7.4.3/babel.min.js"></script>
    ` 
  }
  
  <script type="text/javascript" src="/bundle.js"></script></body>
</html>`

      fs.outputFileSync(targetPath, text)
    })
  }
}
