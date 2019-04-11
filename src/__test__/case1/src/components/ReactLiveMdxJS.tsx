import React, { Component } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'

// import { MDXTag } from '@mdx-js/tag'

const scope = { React, 
  
  // MDXTag, 
  LiveProvider, LiveError, LivePreview }

const code: any = `
const layoutProps = {
  
};
class MDXContent extends React.Component {
  constructor(props) {
    super(props)
    this.layout = null
  }
  render() {
    const { components, ...props } = this.props

    return <MDXTag
             name="wrapper"
             
             components={components}><MDXTag name="h1" components={components}>{\`Hello, world!\`}</MDXTag>
           </MDXTag>
  }
}
//render( <MDXContent /> )
render(<LiveProvider noInline={true} code="render(<h1>Hello</h1>)">
{/* <LiveEditor /> */}
<LiveError />
<LivePreview
  style={{
    width: "100%",
    height: "100%"
  }}
/>
</LiveProvider>)
`
export default class ReactLiveMdxJS extends Component {
  render() {
    return (
        <LiveProvider scope={scope} noInline={true} code={'<h1>Hello2</h1>'}>
          {/* <LiveEditor /> */}
          <LiveError />
          <LivePreview
            style={{
              width: "100%",
              height: "100%"
            }}
          />
        </LiveProvider>
    )
  }
}
