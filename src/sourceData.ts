import glob from 'glob'

import { Config, SourcedData, SourcedDataTextFile } from './typings'

export function sourceData( config: Config ): SourcedData {
  const { siteData } = config
  const { contents } = config.entry

  const remarkFiles = glob.sync( `${contents}/**/*.md` )
  const remarks: SourcedDataTextFile[] = remarkFiles.map( path => ( { path } ) )

  const yamlFiles = glob.sync( `${contents}/**/*.yml` )
  const yamls: SourcedDataTextFile[] = yamlFiles.map( path => ( { path } ) )
  return {
    siteData,
    remarks,
    yamls,
  }
}