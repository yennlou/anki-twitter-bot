import * as path from 'path'
import { unzip, readAnki2, deserializeCards } from '../src/readAnki'
import { clearDir } from '../src/utils'
import { Note } from '../src/interfaces'

const APKG_PATH = path.join(__dirname, 'decks/mock-data.apkg')
const DATA_FOLDER = path.join(__dirname, 'data')
const ANKI2_PATH = path.join(DATA_FOLDER, 'collection.anki2')
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
    .then(unzip(APKG_PATH, DATA_FOLDER))
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
