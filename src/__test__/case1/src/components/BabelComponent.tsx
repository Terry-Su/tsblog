import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import * as Babel from '@babel/standalone'

class Props {
  code?: string = ''
}

class State {}

export default class Template extends Component<Props, State> {
  componentDidMount() {
    var input = `
try {
  ${ this.props.code }
  // function Test() {
  //   return <div>Test123</div>
  // }
  
  class Counter extends React.Component {
    state = { count: 0 }

    onButtonClick = () => {
      this.setState( prevState => ( { count: prevState.count + 1 } ) )
    }

    render() {
      return <div>
      <h1>{ this.state.count }</h1>
      <button onClick={ this.onButtonClick }>Add</button>
      </div>
    }
  }

  ReactDOM.render( <Counter />, document.getElementById( 'renderingDom' ) )
} catch( e ) {
  console.log( e )
}
`;

    let output = ''
    try {
      output = Babel.transform(input, { presets: ["es2015", "react"], plugins: [ 'proposal-class-properties' ] }).code;
    } catch ( e ) {
      console.log( e )
    }

    let ReactAlias = React;
    let ReactDOMAlias = ReactDOM;

    (function() {
      var React = ReactAlias;
      var ReactDOM = ReactDOMAlias;
      eval(output);
    })();
  }

  render() {
    return (
      <div>
        Template
        <div id="renderingDom" />
      </div>
    );
  }
}
