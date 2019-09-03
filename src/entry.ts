import fs from 'fs'
// import trash from 'trash'

import { deploy } from './deploy'
import { __DEV__ } from './global'
import { PATH_PUBLIC } from './paths'
import { sourceData } from './sourceData'
import { transformData } from './transformData'
import { Config, Path } from './typings/index'

export async function run( config: Config ) {
  // if ( !__DEV__ ) {
  //   if ( fs.existsSync( PATH_PUBLIC ) ) {
  //     await trash( PATH_PUBLIC )
  //   } 
  // }
  const getSourcedData = () => sourceData( config )
  const getTransformedData = async () => {
    const sourcedData = getSourcedData()
    return await transformData( sourcedData, config )
  }
  deploy( getTransformedData, config )
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