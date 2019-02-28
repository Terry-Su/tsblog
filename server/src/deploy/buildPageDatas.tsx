import fs from 'fs-extra'
import path from 'path'

import { PATH_PUBLIC_PAGE_DATA } from '../paths'
import { Config, PageInfo, TransformedData, TypeRoute } from '../typings'
import createFileNameOfPath from '../utils/createFileNameOfPath'

const { resolve } = path



export default function buildPageDatas(
  transformedData: TransformedData,
  config: Config,
  pages: PageInfo[]
) {
  pages.map(({ path, data }) => {
    const targetPath = resolve(
      PATH_PUBLIC_PAGE_DATA,
      `${createFileNameOfPath(path)}.json`
    )
    fs.outputJSONSync(targetPath, data)
  })
}
