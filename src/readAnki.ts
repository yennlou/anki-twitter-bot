import * as fs from 'fs'
import * as Database from 'better-sqlite3'
import { Extract } from 'unzipper'
import { SqlNote } from './interfaces'

const unzip = (src: string, dst: string) => () => {
  return fs
    .createReadStream(src)
    .pipe(Extract({ path: dst }))
    .promise()
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
