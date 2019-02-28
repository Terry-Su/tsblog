import fs from 'fs-extra'
import path from 'path'

import {
    PATH_APP_COMPONENT, PATH_BROWSER_COMPONENTS, PATH_CACHE, PATH_CACHE_ENTRY_COMPONENT
} from '../paths'
import createFileNameOfPath from '../utils/createFileNameOfPath'

export default function buildEntryComponentFile( routes ) {
  const browserComponentsRelativePath = path.relative( PATH_CACHE, PATH_BROWSER_COMPONENTS )

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


  const text = 
`import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { hot } from 'react-hot-loader/root'
import loadable from 'react-loadable'
import TSLink from '${browserComponentsRelativePath}/TSLink'

${importing
  .map(
    ( { componentName, componentRelativePath, path } ) =>
      // `import ${componentName} from '${componentRelativePath}'`
      `const ${componentName} = loadable({
        loader: () => import('${componentRelativePath}' /* webpackChunkName: "component-${createFileNameOfPath( path )}-${componentName}" */),
        loading: () => 'Loading',
      });
      `
  )
  .join( "\n" )}

const Template = loadable({
  loader: () => import('../src/browser/components/__template__' /* webpackChunkName: "component--Template" */),
  loading: 'Loading'
})


const browserRoutes: any = [
  ${routes
    .map(
      ( { path, exact, componentName } ) =>
        `{ path: '${path}', exact: ${exact}, component: ${componentName}, },`
    )
    .join( "\n" )}
]

export class App extends Component {
  onLinkMouseover = component => {
    component.preload()
  }

  render() {
    return (
      <div>
        Test2
        <ul>
          {browserRoutes.map(({ path, component }, index) => (
            <li key={index}>
              <span onMouseOver={ () => this.onLinkMouseover( component ) }>
                <TSLink to={path}>{path}</TSLink>
              </span>
            </li>
          ))}
        </ul>
        <Switch>
          {/* <Route exact path="/" component={ Home }></Route>
          <Route path="/foo" component={ Foo }></Route> */}
          {renderRoutes(browserRoutes.filter(({ path }) => path !== "/"))}
        </Switch>
      </div>
    )
  }
}


const HotApp = hot( App )

ReactDOM.render(
  <BrowserRouter>
    <HotApp />
  </BrowserRouter>,
  document.getElementById( 'root' )
)
`

const tmpText = 
`import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import loadable from '@loadable/component'
// import Template from '../src/browser/components/__template__'
// import(/* webpackPrefetch: true */'../src/browser/components/__template__'/* webpackChunkName: "component---src-blog-js" */)
const Template = loadable(() => import('../src/browser/components/__template__'/* webpackChunkName: "component---src-blog-js" */))

import( './add' /* webpackChunkName: "component---src-blog-js3" */).then( data => console.log( data ) )

console.log( Template )

ReactDOM.render(
  <div>
  
  </div>,
  document.getElementById( 'root' )
)
`

  fs.outputFileSync( PATH_CACHE_ENTRY_COMPONENT, text )
}