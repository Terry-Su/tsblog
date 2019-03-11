import glob from 'glob'

import { Config, SourcedData, SourcedDataTextFile } from './typings'

export function sourceData( config: Config ): SourcedData {
  const { siteData } = config
  const { contents, dotFile: dot = true, dotDirectory = true } = config.entry

  const getIgnore = extension => dotDirectory ? [] : [ `${contents}/**/\.*/**/*${extension}` ]

  const remarkFiles = glob.sync( `${contents}/**/*.md`, {
    ignore: getIgnore( '.md' ),
    dot
  } )
  const remarks: SourcedDataTextFile[] = remarkFiles.map( path => ( { path } ) )

  const yamlFiles = glob.sync( `${contents}/**/*.yml`, {
    ignore: getIgnore( '.yml' ),
    dot
  } )
  const yamls: SourcedDataTextFile[] = yamlFiles.map( path => ( { path } ) )

  return {
    siteData,
    remarks,
    yamls,
  }
}