import fs from 'fs'
import yaml from 'js-yaml'
import PATH from 'path'
import showdown from 'showdown'

import {
    Config, SourcedData, TransformedData, TransformedMarkdownFile, TransformedTextFile,
    TransformedYamlFile
} from './typings'

// const yamlParser = text => yaml.load( text )
const yamlParser = text => yaml.safeLoad( text )

const { resolve } = PATH
// import remark from 'remark'
const remark = require( "remark" )

export async function transformData( sourcedData: SourcedData, config: Config ) {
  const transformedRemarks = transformRemarks( sourcedData, config )
  const transformedYamls = transformYamls( sourcedData, config )

  return {
    ...sourcedData,
    remarks: transformedRemarks,
    yamls  : transformedYamls
  }
}

function transformRemarks(
  sourcedData: SourcedData,
  config: Config
): TransformedMarkdownFile[] {
  const { contents } = config.entry
  const { remarks } = sourcedData
  const { parser: configParser = {}, preParser: configPreParser = {} } = config
  const preParser = configPreParser[ ".md" ]
  const defaultParser = text => {
    const converter = new showdown.Converter( { metadata: true } )
    const html = converter.makeHtml( text )
    return html
  }
  const parser = configParser[ ".md" ] || defaultParser
  const remarkYamlParser = text => {
    const converter = new showdown.Converter( { metadata: true } )
    converter.makeHtml( text )
    const yamlText = converter.getMetadata( true )
    const parsed = yamlParser( yamlText )
    return parsed
  }

  const res = remarks.map( ( { path } ) => {
    const extRegexp = new RegExp( `${PATH.extname( path )}$` )
    const relativePath = PATH.relative( contents, path ).replace( /\\/g, '/' ).replace( extRegexp, "" )

    let text = fs.readFileSync( path, { encoding: "utf8" } )
    if ( preParser != null ) {
      text = preParser( text )
    }

    const getSourceText = () => {
      const text = fs.readFileSync( path, { encoding: "utf8" } )
      return text
    }

    const getPreParsedText = () => {
      let text = getSourceText()
      if ( preParser != null ) {
        text = preParser( text )
      }
      return text
    }

    const getText = () => {
      const text = getPreParsedText()
      return parser( text )
    }
    
    const getMetadata = () => {
      const text = getPreParsedText()
      return remarkYamlParser( text )
    }
    return {
      relativePath,
      getSourceText,
      getText,
      getMetadata
    }
  } )
  return res
}

function transformYamls(
  sourcedData: SourcedData,
  config: Config
): TransformedYamlFile[] {
  const { contents } = config.entry
  const { yamls } = sourcedData
  const res = yamls.map( ( { path } ) => {
    const extRegexp = new RegExp( `${PATH.extname( path )}$` )
    const relativePath = PATH.relative( contents, path ).replace( /\\/g, '/' ).replace( extRegexp, "" )

    const getData = () => {
      const text = fs.readFileSync( path, { encoding: "utf8" } )
      return yamlParser( text )
    }
    return {
      relativePath,
      getData
    }
  } )
  return res
}
