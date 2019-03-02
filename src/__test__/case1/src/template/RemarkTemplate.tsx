import React, { Component } from 'react'

import { NAME_GV_CURRENT_PAGE } from '../../../../constants/names'

export default class RemarkTemplate extends Component {
  render() {
    const { metadata, text } = window[ NAME_GV_CURRENT_PAGE ].data
    return <div>
      <h1>{ metadata.title }</h1>
      <hr />
      <div dangerouslySetInnerHTML={{
        __html: text
      }}></div>

    </div>
  }
}