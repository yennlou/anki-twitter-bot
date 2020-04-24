import Twitter = require('twitter-lite')

interface AnkiPost {
  content: string
  image?: string
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

// @ts-ignore
const client = new Twitter({
  consumer_key: TWITTER_API_KEY,
  consumer_secret: TWITTER_SECRET_KEY,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
})

const postTwitter = (post: AnkiPost) => {
  return client.post('statuses/update', {
    status: post.content
  })
}

export { postTwitter }
