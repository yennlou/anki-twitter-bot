import * as fs from 'fs'
import Twit = require('twit')

interface AnkiPost {
  content: string
  imgSrc?: string
}

const {
  TWITTER_API_KEY,
  TWITTER_SECRET_KEY,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET
} = process.env

if (!TWITTER_API_KEY || !TWITTER_SECRET_KEY) {
  throw new Error('twitter api_key & api_secret are not provided.')
}

const client = new Twit({
  consumer_key: TWITTER_API_KEY,
  consumer_secret: TWITTER_SECRET_KEY,
  access_token: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
})

const postTwitter = async (post: AnkiPost) => {
  let mediaUploadResponse: any
  if (post.imgSrc) {
    const imgdata = fs.readFileSync(post.imgSrc)
    const base64Image = Buffer.from(imgdata).toString('base64')
    try {
      mediaUploadResponse = await client.post('media/upload', {
        media_data: base64Image
      })
    } catch (e) {
      throw new Error('Upload Image failed.')
    }
  }
  return client.post('statuses/update', {
    status: post.content,
    media_ids: mediaUploadResponse?.data?.media_id_string
  })
}

export { postTwitter }
