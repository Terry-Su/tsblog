type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Path = string

export type ConfigParser = {
  ".md": Function
}

export type ConfigEntry = {
    title: string,
    home: any
    reduxApp?: Path
    contents?: Path
    static?: Path
    getPages?: Function
    setWebpack?: Function
    tsconfigPath?: Path
    // whether source files whose names start with '.'
    dotFile?: boolean
    // whether source directories whose names start with '.'
    dotDirectory?: boolean
}

export type Config = {
  entry: ConfigEntry

  siteData?: any

  port?: number

  parser?: ConfigParser
}

export interface SourcedData {
  siteData?: any
  remarks: SourcedDataTextFile[]
  yamls: SourcedDataTextFile[]
}

export type SourcedDataTextFile = {
  path: string
}

export interface TransformedData
  extends Omit<SourcedData, "remarks" | "yamls"> {
  remarks: TransformedMarkdownFile[]
  yamls: TransformedYamlFile[]
}

export interface TransformedTextFile {
  relativePath: string
  getText: Function
}

export interface TransformedMarkdownFile extends TransformedTextFile {
  getMetadata: Function
}

export interface TransformedYamlFile {
  relativePath: any
  getData: Function
}

export interface PageInfo {
  path: string
  component: string
  data?: any
}

// # route
export type TypeRoute = {
  path: string
  exact: boolean
  componentName: string
  componentRelativePath: string
  componentAbsolutePath: string
}
