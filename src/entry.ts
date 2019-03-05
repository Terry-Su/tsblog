import fs from 'fs'
import NodeGit, { Repository } from 'nodegit'

import { deploy } from './deploy'
import { sourceData } from './sourceData'
import { transformData } from './transformData'
import { Config, Path } from './typings/index'

export async function run( config: Config ) {
  const sourcedData = sourceData( config )
  const transformedData = await transformData( sourcedData, config )
  deploy( transformedData, config )
}



// let repository: Repository
// const path = require( 'path' )
// const { Revwalk } = NodeGit
// NodeGit.Repository.open( path.resolve( __dirname, '../../blog' ) )
//   .then( repo => {
//     repository = repo
//     return repository.createRevWalk()
//   } )
//   .then( walk => {
//     walk.pushHead()
//     walk.sorting( Revwalk.SORT.TIME )

//   } ).then( fileInfo => {
//     console.log( fileInfo )
//   } )