import * as path from 'path'
import imgcat = require('imgcat')
import { Note } from '../src/interfaces'
import { clearDir } from '../src/utils'
import { unzip, readAnki2, deserializeCards } from '../src/readAnki'
import { makeNoteHtml, makePng } from '../src/makePost'
import { fetchAnkiDeck } from '../src/fetchAnkiDeck'

const DECK_FOLDER = path.join(__dirname, 'decks')
const DATA_FOLDER = path.join(__dirname, 'data')
const POSTS_FOLDER = path.join(__dirname, 'posts')
const DECK_PATH = path.join(DECK_FOLDER, 'mock-data.apkg')
const ANKI2_PATH = path.join(DATA_FOLDER, 'collection.anki2')
const POST_PATH = path.join(POSTS_FOLDER, 'anki.png')
const NOTES_DATA: Note[] = [
  { content: 'question 1\u001fanswer 1' },
  { content: 'question 2\u001fanwser 2' }
]

const trace = (message: string) => (data: any) => {
  console.log(message, `input: ${JSON.stringify(data)}`)
  return data
}

test('should return the notes from apkg file', async () => {
  await Promise.resolve()
    .then(trace('start unzipping...'))
    .then(unzip(DECK_PATH, DATA_FOLDER))
    .then(trace('start reading anki2...'))
    .then(readAnki2(ANKI2_PATH))
    .then(trace('start deserialize the raw data...'))
    .then(deserializeCards)
    .then(trace('test the result...'))
    .then((notes) => {
      expect(notes).toEqual(NOTES_DATA)
    })
    .finally(clearDir(DATA_FOLDER))
})

test('shoud make a png file from a note', async () => {
  await Promise.resolve(NOTES_DATA[0])
    .then(makeNoteHtml)
    .then((html) => makePng(html, POST_PATH))
    .then(() => imgcat(POST_PATH))
    .then(console.log)
    .finally(clearDir(POSTS_FOLDER))
})

test.only('should fetch the anki deck', async () => {
  await fetchAnkiDeck('mock-data.apkg', DECK_PATH)
})
