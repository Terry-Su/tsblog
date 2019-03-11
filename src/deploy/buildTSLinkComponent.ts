import fs from 'fs-extra'
import path from 'path'

import { NAME_GV_CURRENT_PAGE, NAME_PUBLIC_PAGE_DATA } from '../constants/names'
import { PATH_CACHE, PATH_CACHE_TSLINK_COMPONENT, PATH_UTIL } from '../paths'
import { Config } from '../typings'
import createFileNameOfPath from '../utils/createFileNameOfPath'

export default function buildTSLinkComponent( routes, config: Config ) {
  const utilsRelativePath = path.relative( PATH_CACHE, PATH_UTIL )

  const text = 
`import fetch from 'isomorphic-fetch'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import createFileNameOfPath from '${ utilsRelativePath }/createFileNameOfPath'

export default withRouter (
  class TSLink extends Component<{
    to: string
    children?: any
    history?: any
    className?: any
    style?: any
  }> {
    onClick = e => {
      e.preventDefault()
      const { to } = this.props
      const url = '/${NAME_PUBLIC_PAGE_DATA}/' + createFileNameOfPath( to ) + '.json'
      fetch( url ).then( response => response.json() ).then( data => {
        window[ '${ NAME_GV_CURRENT_PAGE }' ] = {
          path: to,
          data: data,
        }
        this.props.history.push( to )
      } )
    }
    render() {
      const { children, to, className, style } = this.props
      return <a onClick={ this.onClick } href={ to } className={className} style={style} >
        { ...children }
      </a>
    }
  }
)
`
  fs.outputFileSync( PATH_CACHE_TSLINK_COMPONENT, text )
}
