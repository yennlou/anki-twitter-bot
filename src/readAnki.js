const path = require('path')
const { promisify } = require('util')
const { createReadStream } = require('fs')
const { pipeline } = require('stream')
const pipe = promisify(pipeline)
const Database = require('better-sqlite3')
const unzipper = require('unzipper')
const { clearDir } = require('./utils')

const unzip = (src, dst) => {
  console.log('start unzipping...')
  const source = createReadStream(src)
  const promise = pipe(source, unzipper.Extract({ path: dst }))
  console.log('unzip completed.')
  return promise
}

const readDataDir = (dir) => () => {
  console.log('start reading anki2...')
  const db = new Database(
    path.join(dir, 'collection.anki2'),
    { verbose: console.log }
  )
  const notes = db.prepare('SELECT * FROM notes').all()
  console.log('notes extracted.')
  return Promise.resolve(notes)
}

const processCards = (notes) => {
  return Promise.resolve(notes.map(note => ({
    content: note.flds
  })))
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
