import fs from 'fs-extra'
import path from 'path'

import { isDev } from '../constants/global'
import {
    PATH_APP_COMPONENT, PATH_BROWSER_COMPONENTS, PATH_CACHE, PATH_CACHE_ENTRY_COMPONENT,
    PATH_CACHE_ENTRY_COMPONENT_JSX
} from '../paths'
import { Config } from '../typings'
import createFileNameOfPath from '../utils/createFileNameOfPath'

export default function buildEntryComponentFile( routes, config: Config ) {
  const browserComponentsRelativePath = path.relative(
    PATH_CACHE,
    PATH_BROWSER_COMPONENTS
  )

  const importing = ( () => {
    let res = []
    let relativePaths = []

    routes.map( ( { componentName, componentRelativePath, path } ) => {
      if ( !relativePaths.includes( componentRelativePath ) ) {
        relativePaths.push( componentRelativePath )
        res.push( { componentName, componentRelativePath, path } )
      }
    } )
    return res
  } )()

  const { reduxApp } = config.entry
  const enableRedux = !!reduxApp
  const relativeReduxApp = path.relative( PATH_CACHE, reduxApp )

  const text = `import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import loadable from 'react-loadable'
import App from './App'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
${enableRedux ? `
import reducer from '${ relativeReduxApp }'

const reduxStore = createStore( reducer )
` : ""}





${ isDev ? 'const HotApp = hot( App )' : '' }
loadable.preloadReady().then( () => 
  ReactDOM.${isDev ? "render" : "hydrate"}(
      ${
        enableRedux ? "<Provider store={ reduxStore }>" : ""
      }<BrowserRouter>
        ${ isDev ? '<HotApp />' : '<App />' }
      </BrowserRouter>${enableRedux ? "</Provider>" : ""},
    document.getElementById( 'root' )
  )
)

`
  fs.outputFileSync( PATH_CACHE_ENTRY_COMPONENT, text )
}
