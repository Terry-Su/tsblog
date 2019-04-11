import React, { Component } from 'react'
import loadable from 'react-loadable'
import styled from 'styled-components'

import { NAME_GV_CURRENT_PAGE } from '../../../../constants/names'
import BabelComponent from '../components/BabelComponent'

const StyledLoading = styled.div`
  width: 100%;
  height: 100%;
  background: hsl(27, 39%, 95%);
`

// const ReactLiveMdxJS = loadable({
//   loader: () => import('./ReactLiveMdxJS' /* webpackChunkName: "component-ReactLiveMdxJS" */),
//   loading: () => <StyledLoading></StyledLoading>,
//   modules: ['./ReactLiveMdxJS'],
//   webpack: () => [(require as any).resolveWeak('./ReactLiveMdxJS')],
// });

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
        <BabelComponent />
      </div>
    )
  }
}
