import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import loadable from 'react-loadable'
import styled from 'styled-components'

import Live from '@/components/Live'
import { NAME_GV_CURRENT_PAGE } from '@src/constants/names'

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

window[ 'ReactDOM' ] = ReactDOM

export default class Home extends Component {
  render() {
    const { title } = window[NAME_GV_CURRENT_PAGE].data.siteData
    return (
      <div>
        <Title>Title: {title}</Title>
        <Live code={`
class App extends React.Component {
  state = { count: 0 }

  onClick = () => {
    this.setState( prevState => ({ count: prevState.count + 1 }) )
  }

  render() {
    return <div>
      <h1>{ this.state.count }</h1>
      <button onClick={ this.onClick }>Click</button>
    </div>
  }
}
render(<App />)
`}/>
      </div>
    )
  }
}
