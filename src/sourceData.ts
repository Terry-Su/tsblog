import glob from 'glob'

import { Config, SourcedData, SourcedDataTextFile } from './typings'

export function sourceData( config: Config ): SourcedData {
  const { siteData } = config
  const { contents, dotFile: dot = true, dotDirectory = true } = config.entry

  const globIgnore = dotDirectory ? `` : `[^.]`

  const remarkFiles = glob.sync( `${contents}/${globIgnore}**/*.md`, {
    dot
  } )
  const remarks: SourcedDataTextFile[] = remarkFiles.map( path => ( { path } ) )

  const yamlFiles = glob.sync( `${contents}/${globIgnore}**/*.yml$`, {
    dot
  } )
  const yamls: SourcedDataTextFile[] = yamlFiles.map( path => ( { path } ) )
  return {
    siteData,
    remarks,
    yamls,
  }
}