import React, { Component } from 'react'

import { NAME_GV_CURRENT_PAGE } from '../../../../constants/names'

export default class Home extends Component {
  render() {
    const { title } = window[ NAME_GV_CURRENT_PAGE ].data.siteData
    // console.log( window[ NAME_GV_CURRENT_PAGE ] )
    return <div>
      <h1>Title: { title }</h1>
    </div>
  }
}