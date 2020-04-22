import * as AWS from 'aws-sdk'
import * as fs from 'fs'
const BUCKET_NAME = 'anki-bucket'

const s3 = new AWS.S3()

const fetchAnkiDeck = (key: string, dst: string) => {
  return new Promise((resolve, reject) => {
    const dstStream = fs.createWriteStream(dst)
    return s3
      .getObject({
        Bucket: BUCKET_NAME,
        Key: key
      })
      .createReadStream()
      .pipe(dstStream)
      .on('error', reject)
      .on('close', resolve)
  })
}

export { fetchAnkiDeck }
