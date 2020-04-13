const path = require('path')
const { promisify } = require('util')
const { createReadStream } = require('fs')
const { pipeline } = require('stream')
const pipe = promisify(pipeline)
const unzipper = require('unzipper')

const unzip = (src, dst) => {
  const source = createReadStream(src)
  return pipe(source, unzipper.Extract({ path: dst }))
}

const main = () => {
  const src = path.join(__dirname, 'decks/front-end-interview-handbook.apkg')
  const dst = path.join(__dirname, 'data')
  unzip(src, dst)
    .then(() => {
      console.log('unzip finished.')
    })
    .catch(e => {
      console.log(e)
    })
}

main()
