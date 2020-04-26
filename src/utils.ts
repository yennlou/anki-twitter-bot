import * as path from 'path'
import * as fs from 'fs'

const clearDir = (dir: string) => {
  const files = fs.readdirSync(dir)
  files.forEach((file: string) => {
    fs.unlinkSync(path.join(dir, file))
  })
}

export const createTmpFolder = (currentDir: string) => {
  const tmpDir = path.join(currentDir, 'tmp')
  if (fs.existsSync(tmpDir)) return
  fs.mkdirSync(tmpDir)
}

export const destroyTmpFolder = (currentDir: string) => {
  const tmpDir = path.join(currentDir, 'tmp')
  if (!fs.existsSync(tmpDir)) return
  clearDir(tmpDir)
  fs.rmdirSync(tmpDir)
}
