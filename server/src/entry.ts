import fs from 'fs'

import { deploy } from './deploy'
import { sourceData } from './sourceData'
import { transformData } from './transformData'
import { Config, Path } from './typings/index'

export async function run( config: Config ) {
  const sourcedData = sourceData( config )
  const transformedData = await transformData( sourcedData, config )
  deploy( transformedData, config )
}