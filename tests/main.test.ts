import * as fs from 'fs'
import * as path from 'path'
import imgcat = require('imgcat')
import { Note } from '../src/interfaces'
import { createTmpFolder, destroyTmpFolder } from '../src/utils'
import {
  unzip,
  findAll,
  findOne,
  findOneRandomly,
  deserializeNote
} from '../src/readAnki'
import { makeNoteHtml, makePng } from '../src/makePost'
import { fetchAnkiDeck } from '../src/fetchAnkiDeck'
import { postTwitter } from '../src/postTwitter'

beforeEach(() => createTmpFolder(__dirname))
afterEach(() => destroyTmpFolder(__dirname))

// const DECK_KEY = 'mock-data.apkg'
const DECK_KEY = 'front-end-interview-handbook.apkg'
const DECK_PATH = path.join(__dirname, 'decks/mock-data.apkg')
const TMP_FOLDER = path.join(__dirname, 'tmp')
const TEST_PNG_PATH = path.join(__dirname, 'test.png')

const NOTES_DATA: Note[] = [
  { content: 'question 1\u001fanswer 1' },
  { content: 'question 2\u001fanwser 2' }
]

const trace = (message: string) => (data: any) => {
  console.log(message, `output: ${JSON.stringify(data)}`)
  return data
}

test('should fetch the anki deck', async () => {
  await fetchAnkiDeck(DECK_KEY, path.join(TMP_FOLDER, DECK_KEY))
    .then(() => fs.existsSync(path.join(TMP_FOLDER, DECK_KEY)))
    .then(trace('deck fetched'))
})

test('should return the notes from apkg file', async () => {
  await Promise.resolve()
    .then(unzip(DECK_PATH, TMP_FOLDER))
    .then(findAll(path.join(TMP_FOLDER, 'collection.anki2')))
    .then((notes) => notes.map(deserializeNote))
    .then(trace('notes extracted'))
    .then((notes) => {
      expect(notes).toEqual(NOTES_DATA)
    })
})

test('should return a random note from apkg file', async () => {
  await Promise.resolve()
    .then(unzip(DECK_PATH, TMP_FOLDER))
    .then(findOneRandomly(path.join(TMP_FOLDER, 'collection.anki2')))
    .then(deserializeNote)
    .then(trace('note extracted'))
})

test('shoud make a png file from a note', async () => {
  await Promise.resolve(NOTES_DATA[0])
    .then(makeNoteHtml)
    .then((html) => makePng(html, path.join(TMP_FOLDER, 'anki.png')))
    .then(() => imgcat(path.join(TMP_FOLDER, 'anki.png')))
    .then(console.log)
})

test.skip('should tweet a flashcard', async () => {
  await postTwitter({
    content: 'test test',
    imgSrc: TEST_PNG_PATH
  })
})

test.only('should fetch, make note and post', async () => {
  const TMP_DECK_PATH = path.join(TMP_FOLDER, DECK_KEY)
  const TMP_ANKI2_PATH = path.join(TMP_FOLDER, 'collection.anki2')
  const TMP_IMAGE_PATH = path.join(TMP_FOLDER, 'anki.png')

  await fetchAnkiDeck(DECK_KEY, TMP_DECK_PATH)
    .then(unzip(TMP_DECK_PATH, TMP_FOLDER))
    // .then(findOneRandomly(TMP_ANKI2_PATH))
    .then(findOne(TMP_ANKI2_PATH, 1588042748239))
    .then(deserializeNote)
    .then(makeNoteHtml)
    .then((html) => makePng(html, TMP_IMAGE_PATH))
    .then(() => imgcat(TMP_IMAGE_PATH))
    .then(console.log)
  // .then(() => postTwitter({ content: '', imgSrc: TMP_IMAGE_PATH }))
}, 20000)
