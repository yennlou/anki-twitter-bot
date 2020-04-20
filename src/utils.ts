import * as path from 'path'
import * as fs from 'fs'

export const clearDir = (dir: string) => () => {
  const files = fs.readdirSync(dir)
  files.forEach((file: string) => {
    fs.unlinkSync(path.join(dir, file))
  })
}
