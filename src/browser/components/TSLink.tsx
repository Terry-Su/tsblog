import fetch from 'isomorphic-fetch'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { NAME_GV_CURRENT_PAGE, NAME_PUBLIC_PAGE_DATA } from '../../constants/names'
import createFileNameOfPath from '../../utils/createFileNameOfPath'

export default withRouter (
  class TSLink extends Component<{
    to: string
    children?: any
    history?: any
  }> {
    onClick = e => {
      e.preventDefault()
      const { to } = this.props
      const url = `/${NAME_PUBLIC_PAGE_DATA}/${createFileNameOfPath( to )}.json`
      fetch( url ).then( response => response.json() ).then( data => {
        window[ NAME_GV_CURRENT_PAGE ] = {
          path: to,
          data: data,
        }
        this.props.history.push( to )
      } )
    }
    render() {
      const { children, to } = this.props
      return <a onClick={ this.onClick } href={ to }>
        { ...children }
      </a>
    }
  }
)