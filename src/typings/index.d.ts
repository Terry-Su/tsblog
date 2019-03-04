
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Path = string

export type Config = {
  entry: {
    home: any
    contents?: Path
    static?: Path
    getPages?: Function,
    setWebpack?: Function,
    tsconfigPath?: Path
  }

  siteData?: any,

  port?: number
}

export interface SourcedData {
  siteData?: any
  remarks: SourcedDataTextFile[]
  yamls: SourcedDataTextFile[]
}

export type SourcedDataTextFile = {
  path: string
}


export interface TransformedData extends Omit<SourcedData, 'remarks' | 'yamls'> {
  remarks: TransformedMarkdownFile[],
  yamls: TransformedYamlFile[]
}

export interface TransformedTextFile {
  relativePath: string,
  text: string,
}

export interface TransformedMarkdownFile extends TransformedTextFile {
  metadata: any
}

export interface TransformedYamlFile {
  relativePath: any
  data: any
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