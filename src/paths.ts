import path from 'path'

import { NAME_PUBLIC_PAGE_DATA } from './constants/names'

const { resolve } = path

// # node_modules
export const PATH_NODE_MODULES = path.resolve( __dirname,'../node_modules' )
export const PATH_TARGET_REACT_LOADABLE = path.resolve( process.cwd(), 'node_modules/react-loadable' )
export const PATH_TARGET_STYLED_COMPONENTS = path.resolve( process.cwd(), 'node_modules/styled-components' )

// # .cache
export const PATH_CACHE = path.resolve( process.cwd(), '.cache' )
export const PATH_CACHE_ENTRY_COMPONENT = resolve( PATH_CACHE, 'Entry.tsx' ) 
export const PATH_CACHE_ENTRY_COMPONENT_JSX = resolve( PATH_CACHE, 'Entry.jsx' ) 
export const PATH_CACHE_APP_COMPONENT = resolve( PATH_CACHE, 'App.tsx' ) 
export const PATH_CACHE_APP_COMPONENT_JSX = resolve( PATH_CACHE, 'App.jsx' ) 

// # browser
export const PATH_BROWSER_COMPONENTS = path.resolve( __dirname, 'browser/components' )


// # public
export const PATH_PUBLIC = path.resolve( process.cwd(), 'public' )
export const PATH_PUBLIC_INDEX_HTML = path.resolve( PATH_PUBLIC, 'index.html' )
export const PATH_PUBLIC_PAGE_DATA = path.resolve( PATH_PUBLIC, NAME_PUBLIC_PAGE_DATA )
// ## loadable
export const PATH_PUBLIC_LOADABLE = path.resolve( PATH_PUBLIC, 'loadable.json' )

// # component
export const PATH_APP_COMPONENT = resolve( __dirname, 'deploy/App' )

// # html
export const PATH_INDEX_HTML = resolve( __dirname, 'deploy/index.html' )

// # webpack
export const PATH_WEBPACK_TSCONFIG = resolve( __dirname, 'deploy/tsconfig.json' )