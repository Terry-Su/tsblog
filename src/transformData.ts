import fs from 'fs'
import yaml from 'js-yaml'
import PATH from 'path'
import showdown from 'showdown'

import {
    Config, SourcedData, TransformedData, TransformedMarkdownFile, TransformedTextFile,
    TransformedYamlFile
} from './typings'

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

  const res = remarks.map( ( { path } ) => {
    const extRegexp = new RegExp( `${PATH.extname( path )}$` )
    const relativePath = PATH.relative( contents, path ).replace( extRegexp, "" )

    const getInfo = () => {
      const text = fs.readFileSync( path, { encoding: "utf8" } )
      const converter = new showdown.Converter( { metadata: true } )
      const html = converter.makeHtml( text )      
      return { converter, html }
    }

    const getText = () => {
      return getInfo().html
    }
    const getMetadata = () => getInfo().converter.getMetadata()
    return {
      relativePath,
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
    const relativePath = PATH.relative( contents, path ).replace( extRegexp, "" )
    
    const getData = () => {
      const text = fs.readFileSync( path, { encoding: "utf8" } )
      return yaml.safeLoad( text )
    }
    return {
      relativePath,
      getData
    }
  } )
  return res
}
