import * as fs from 'fs'
import { promisify } from 'util'
import { pipeline } from 'stream'
import * as Database from 'better-sqlite3'
import { Extract } from 'unzipper'
import { SqlNote } from './interfaces'

const pipe = promisify(pipeline)

const unzip = (src: string, dst: string) => () => {
  const source = fs.createReadStream(src)
  const promise = pipe(source, Extract({ path: dst }))
  return promise
}

const readAnki2 = (path: string) => () => {
  const db = new Database(path)
  const notes = db.prepare('SELECT * FROM notes').all()
  return notes
}

const deserializeCards = (notes: SqlNote[]) => {
  return notes.map((note) => ({
    content: note.flds
  }))
}

export { unzip, readAnki2, deserializeCards }
