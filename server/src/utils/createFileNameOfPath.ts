export default function createFileNameOfPath( path: string ) {
  return path.replace( /\//g, "-" )
}