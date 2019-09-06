import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import * as Babel from '@babel/standalone'

class Props {
  code?: string = ''
  scope?: any
}

class State {}

declare const $ReactDOMServer: any

const isRunningNodeJS = window[ '$ReactDOMServer' ] != null

export default class Live extends Component<Props, State> {
  ref: any = React.createRef()

  ssrHtml: string = ''

  constructor( props ) {
    super( props )

    if ( isRunningNodeJS ) {
      this.runCodes()
    }
  }

  componentDidMount() {
    this.runCodes( this.ref.current )
  }

  runCodes( dom ?: HTMLElement) {
    const input = `
try {
  ` + this.props.code + `
} catch( e ) {
  console.log( e )
}
`
    let output = ''
    try {
      output = Babel.transform(input, { presets: ["es2015", "react"], plugins: [ 'proposal-class-properties' ] }).code;
    } catch ( e ) {
      console.log( e )
      return
    }
    let { scope: __$$__scope__$$__ = {} } = this.props
    __$$__scope__$$__ = {
      React,
      ReactDOM,
      styled,
      ...__$$__scope__$$__
    }
  
    {
      (() => {
        // # scope
        let declareScript = ''
        for ( let key in __$$__scope__$$__ ) {
          const value = __$$__scope__$$__[ key ]
          declareScript = `${declareScript}
var ${key} = __$$__scope__$$__[ '${key}' ]`
        }

        // # render function
        var render = ! isRunningNodeJS ? 
        element => ReactDOM.hydrate( element, dom ) :
        element => { this.ssrHtml = window[ '$ReactDOMServer' ].renderToString( element ) };

        eval(declareScript + '\n' + output);
      })()
    }
  }

  render() {
    return (
      <div>
        {
          !isRunningNodeJS ? <div ref={ this.ref } /> : <div dangerouslySetInnerHTML={{
            __html: ! isRunningNodeJS ? '' : this.ssrHtml 
          }} />
        }
      </div>
    );
  }
}
