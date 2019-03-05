import fs from 'fs-extra'
import path from 'path'
import React from 'react'

import { NAME_GV_CURRENT_PAGE } from '../constants/names'
import {
    PATH_APP_COMPONENT, PATH_BROWSER_COMPONENTS, PATH_CACHE, PATH_CACHE_APP_COMPONENT,
    PATH_CACHE_ENTRY_COMPONENT, PATH_NODE_MODULES
} from '../paths'
import createFileNameOfPath from '../utils/createFileNameOfPath'

export default function buildAppComponent( routes ) {
  const browserComponentsRelativePath = path.relative( PATH_CACHE, PATH_BROWSER_COMPONENTS )

  const nodeModulesRelativePath = path.relative( PATH_CACHE, PATH_NODE_MODULES )

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
import { Switch, withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import loadable from 'react-loadable'
// import loadable from '${nodeModulesRelativePath}/react-loadable/babel'
// const loadable = require( '${nodeModulesRelativePath}/react-loadable/babel' ).default

const TSLink = loadable({
  loader: () => import('./TSLink' /* webpackChunkName: "component-TSLink" */),
  loading: () => <span></span>,
  modules: ['./TSLink'],
  webpack: () => [(require as any).resolveWeak('./TSLink')],
});



${importing
  .map(
    ( { componentName, componentRelativePath, path } ) =>
      `const ${componentName} = loadable({
        loader: () => import('${componentRelativePath}' /* webpackChunkName: "component-${createFileNameOfPath( path )}-${componentName}" */),
        loading: () => <span></span>,
        modules: ['${componentRelativePath}'],
        webpack: () => [(require as any).resolveWeak('${componentRelativePath}')],
      });
      `
  )
  .join( "\n" )}

let pagesData = []

const browserRoutes = [
  ${routes
    .map(
      ( { path, exact, componentName } ) =>
        `{ path: '${path}', exact: ${exact}, render: () => {
        // Update global window data
        const found = pagesData.filter( data => data.path === '${path}' )[ 0 ]
        if ( found ) {
          window[ '${ NAME_GV_CURRENT_PAGE }' ] = found
        } else {
          pagesData.push( window[ '${ NAME_GV_CURRENT_PAGE }' ] )
        }
          return <${componentName} />
        }, },`
    )
    .join( "\n" )}
]

export default withRouter(
class App extends Component<any> {
  onLinkMouseover = component => {
    component.preload()
  }


  componentDidMount() {
    this.props.history.listen( this.onRouteChange );
  }

  onRouteChange = ({ pathname }) => {
    // console.log( 'route changed' ) 
  }


  render() {
    return (
      <div style={{
        width: '100%',
        height: '100%',
      }}>
      {/* <ul>
        {browserRoutes.map(({ path, component }, index) => (
          <li key={index}>
            <span onMouseOver={ () => this.onLinkMouseover( component ) }>
              <TSLink to={path}>{path}</TSLink>
            </span>
          </li>
        ))}
      </ul> */}
        <Switch>
          {renderRoutes(browserRoutes)}
        </Switch>
      </div>
    )
  }
}
)
`

  fs.outputFileSync( PATH_CACHE_APP_COMPONENT, text )
}