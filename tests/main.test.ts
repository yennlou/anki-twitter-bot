import * as fs from 'fs'
import * as path from 'path'
import imgcat = require('imgcat')
import { Note } from '../src/interfaces'
import { clearDir } from '../src/utils'
import { unzip, readAnki2, deserializeCards } from '../src/readAnki'
import { makeNoteHtml, makePng } from '../src/makePost'
import { fetchAnkiDeck } from '../src/fetchAnkiDeck'

const DECK_KEY = 'mock-data.apkg'
const DECK_PATH = path.join(__dirname, 'decks/mock-data.apkg')
const TMP_FOLDER = path.join(__dirname, 'tmp')

const NOTES_DATA: Note[] = [
  { content: 'question 1\u001fanswer 1' },
  { content: 'question 2\u001fanwser 2' }
]

const trace = (message: string) => (data: any) => {
  console.log(message, `output: ${JSON.stringify(data)}`)
  return data
}

test('should return the notes from apkg file', async () => {
  await Promise.resolve()
    .then(unzip(DECK_PATH, TMP_FOLDER))
    .then(readAnki2(path.join(TMP_FOLDER, 'collection.anki2')))
    .then(deserializeCards)
    .then(trace('note extracted'))
    .then((notes) => {
      expect(notes).toEqual(NOTES_DATA)
    })
    .finally(clearDir(TMP_FOLDER))
})

test('shoud make a png file from a note', async () => {
  await Promise.resolve(NOTES_DATA[0])
    .then(makeNoteHtml)
    .then((html) => makePng(html, path.join(TMP_FOLDER, 'anki.png')))
    .then(() => imgcat(path.join(TMP_FOLDER, 'anki.png')))
    .then(console.log)
    .finally(clearDir(TMP_FOLDER))
})

test.only('should fetch the anki deck', async () => {
  await fetchAnkiDeck(DECK_KEY, path.join(TMP_FOLDER, DECK_KEY))
    .then(() => fs.existsSync(path.join(TMP_FOLDER, DECK_KEY)))
    .then(trace('deck fetched'))
    .finally(clearDir(TMP_FOLDER))
})
