import React, { Component } from 'react'

import { NAME_GV_CURRENT_PAGE } from '../../../../constants/names'

export default class Home extends Component {
  render() {
    const { title } = window[ NAME_GV_CURRENT_PAGE ].data.siteData
    return <div>
      <h1>Title: { title }</h1>
    </div>
  }
}