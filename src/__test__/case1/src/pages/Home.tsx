import React, { Component } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import styled from 'styled-components'

import { NAME_GV_CURRENT_PAGE } from '../../../../constants/names'

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

export default class Home extends Component {
  render() {
    const { title } = window[NAME_GV_CURRENT_PAGE].data.siteData
    return (
      <div>
        <Title>Title: {title}</Title>
        <LiveProvider code="<strong>Hello World!</strong>">
          <LiveEditor />
          {/* <LiveError /> */}
          <LivePreview />
        </LiveProvider>
      </div>
    )
  }
}
