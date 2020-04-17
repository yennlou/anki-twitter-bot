import * as path from 'path'
import * as fs from 'fs'

export const clearDir = (dir: string) => () => {
  console.log('start cleaning the target directory...')
  const files = fs.readdirSync(dir)
  files.forEach((file: string) => {
    fs.unlinkSync(path.join(dir, file))
  })
  console.log('cleaning completed.')
}
