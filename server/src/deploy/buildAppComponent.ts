import fs from 'fs-extra'
import path from 'path'

import {
    PATH_APP_COMPONENT, PATH_BROWSER_COMPONENTS, PATH_CACHE, PATH_CACHE_APP_COMPONENT,
    PATH_CACHE_ENTRY_COMPONENT
} from '../paths'
import createFileNameOfPath from '../utils/createFileNameOfPath'

export default function buildAppComponent( routes ) {
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
import { Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import loadable from 'react-loadable'
// import TSLink from '${browserComponentsRelativePath}/TSLink'

const TSLink = loadable({
  loader: () => import('${browserComponentsRelativePath}/TSLink' /* webpackChunkName: "component-TSLink" */),
  loading: () => <span>Loading</span>,
});
console.log( TSLink )

${importing
  .map(
    ( { componentName, componentRelativePath, path } ) =>
      // `import ${componentName} from '${componentRelativePath}'`
      `const ${componentName} = loadable({
        loader: () => import('${componentRelativePath}' /* webpackChunkName: "component-${createFileNameOfPath( path )}-${componentName}" */),
        loading: () => <span>Loading</span>,
      });
      `
  )
  .join( "\n" )}


const browserRoutes: any = [
  ${routes
    .map(
      ( { path, exact, componentName } ) =>
        `{ path: '${path}', exact: ${exact}, component: ${componentName}, },`
    )
    .join( "\n" )}
]

export default class App extends Component {
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
          {renderRoutes(browserRoutes.filter(({ path }) => path !== "/"))}
        </Switch>
      </div>
    )
  }
}
`

  fs.outputFileSync( PATH_CACHE_APP_COMPONENT, text )
}