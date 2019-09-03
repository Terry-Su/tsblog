import fs from 'fs-extra'
import path from 'path'

import { __DEV__ } from '../global'
import {
    PATH_APP_COMPONENT, PATH_BROWSER_COMPONENTS, PATH_CACHE, PATH_CACHE_ENTRY_COMPONENT
} from '../paths'
import { Config } from '../typings'
import createFileNameOfPath from '../utils/createFileNameOfPath'

export default function buildEntryComponentFile( routes, config: Config ) {
  const { reduxApp } = config.entry
  const enableRedux = !!reduxApp

  const text = `import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import loadable from 'react-loadable'
import App from './App'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
${enableRedux ? `
import reducer from '${ path.relative( PATH_CACHE, reduxApp ).replace( /\\/g, '/' ) }'

const reduxStore = createStore( reducer )
` : ""}





${ __DEV__ ? 'const HotApp = hot( App )' : '' }
loadable.preloadReady().then( () => 
  ReactDOM.${__DEV__ ? "render" : "hydrate"}(
      ${
        enableRedux ? "<Provider store={ reduxStore }>" : ""
      }<BrowserRouter>
        ${ __DEV__ ? '<HotApp />' : '<App />' }
      </BrowserRouter>${enableRedux ? "</Provider>" : ""},
    document.getElementById( 'root' )
  )
)

`
  fs.outputFileSync( PATH_CACHE_ENTRY_COMPONENT, text )
}
