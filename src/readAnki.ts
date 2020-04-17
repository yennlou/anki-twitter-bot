import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import { pipeline } from 'stream'
import * as Database from 'better-sqlite3'
import { Extract } from 'unzipper'
import { clearDir } from './utils'
import { SqlNote, Note } from './interfaces'

const pipe = promisify(pipeline)

const unzip = (src: string, dst: string): Promise<void> => {
  console.log('start unzipping...')
  const source = fs.createReadStream(src)
  const promise = pipe(source, Extract({ path: dst }))
  console.log('unzip completed.')
  return promise
}

const readDataDir = (dir: string) => () => {
  console.log('start reading anki2...')
  const db = new Database(path.join(dir, 'collection.anki2'), {
    verbose: console.log
  })
  const notes = db.prepare('SELECT * FROM notes').all()
  console.log('notes extracted.')
  return Promise.resolve(notes)
}

const processCards = (notes: SqlNote[]): Promise<Note[]> => {
  return Promise.resolve(
    notes.map((note) => ({
      content: note.flds
    }))
  )
}

const main = () => {
  const src = path.join(__dirname, 'decks/front-end-interview-handbook.apkg')
  const dst = path.join(__dirname, 'data')

  unzip(src, dst)
    .then(readDataDir(dst))
    .then(processCards)
    .then(console.log)
    .catch(console.log)
    .finally(clearDir(dst))
}

main()
