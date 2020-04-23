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

const findAll = (dbPath: string) => () => {
  const db = new Database(dbPath)
  const notes = db.prepare('SELECT * FROM notes').all()
  return notes
}

const findOneRandomly = (dbPath: string) => () => {
  const db = new Database(dbPath)
  const note = db.prepare('SELECT * FROM notes ORDER BY RANDOM() LIMIT 1').get()
  return note
}

const deserializeNote = (note: SqlNote) => {
  return {
    content: note.flds
  }
}

export { unzip, findAll, deserializeNote, findOneRandomly }
