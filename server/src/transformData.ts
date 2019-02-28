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
    const text = fs.readFileSync( path, { encoding: "utf8" } )
    const extRegexp = new RegExp( `${ PATH.extname( path ) }$` )
    const relativePath = PATH.relative( contents, path ).replace( extRegexp, '' )
    const converter = new showdown.Converter( { metadata: true } )
    const html = converter.makeHtml( text )
    const metadata = converter.getMetadata()
    return {
      text: html,
      relativePath,
      metadata
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
    const extRegexp = new RegExp( `${ PATH.extname( path ) }$` )
    const relativePath = PATH.relative( contents, path ).replace( extRegexp, '' )
    const text = fs.readFileSync( path, { encoding: "utf8" } )
    const data = yaml.safeLoad( text )
    return {
      relativePath,
      data
    }
  } )
  return res
}
