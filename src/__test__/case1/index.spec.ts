import { run } from '../../entry'
import config from './tsblog.config'

// describe( "Test", () => {
//   it( "Unit", () => {
//   } )
// } )

describe( "long asynchronous specs", function() {
  var originalTimeout
  beforeEach( function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000
  } )

  it( "takes a long time", function( done ) {
    run( config )
  } )

  afterEach( function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  } )
} )
