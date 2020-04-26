import * as path from 'path'
import { createTmpFolder } from '../src/utils'
import { unzip, findOneRandomly, deserializeNote } from '../src/readAnki'
import { makeNoteHtml, makePng } from '../src/makePost'
import { fetchAnkiDeck } from '../src/fetchAnkiDeck'
import { postTwitter } from '../src/postTwitter'

export const main = async () => {
  const DECK_KEY = process.env.DECK_KEY
  if (!DECK_KEY) throw Error('DECK_KEY must be provided.')

  const TMP_FOLDER = path.join(__dirname, 'tmp')
  const TMP_DECK_PATH = path.join(TMP_FOLDER, DECK_KEY)
  const TMP_ANKI2_PATH = path.join(TMP_FOLDER, 'collection.anki2')
  const TMP_IMAGE_PATH = path.join(TMP_FOLDER, 'anki.png')

  createTmpFolder(__dirname)

  await fetchAnkiDeck(DECK_KEY, TMP_DECK_PATH)
    .then(unzip(TMP_DECK_PATH, TMP_FOLDER))
    .then(findOneRandomly(TMP_ANKI2_PATH))
    .then(deserializeNote)
    .then(makeNoteHtml)
    .then((html) => makePng(html, TMP_IMAGE_PATH))
    .then(() => postTwitter({ content: '', imgSrc: TMP_IMAGE_PATH }))

  return {
    message: 'test'
  }
}
