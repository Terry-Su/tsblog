export default function deserialize( serialized ) {
  return eval( `(${ serialized })` )
}