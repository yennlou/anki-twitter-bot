const path = require('path')
const fs = require('fs')
const yargs = require('yargs')
const dotenv = require('dotenv')
const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-southeast-2' })
const cloudformation = new AWS.CloudFormation()
const TemplateBody = fs
  .readFileSync(path.join(__dirname, './codeBuildStack.yml'))
  .toString()

const makeParams = () => {
  const {
    DECK_KEY: DeckKey,
    TWITTER_API_KEY: TwitterApiKey,
    TWITTER_SECRET_KEY: TwitterSecretKey,
    TWITTER_ACCESS_TOKEN: TwitterAccessToken,
    TWITTER_ACCESS_TOKEN_SECRET: TwitterAccessTokenSecret
  } = dotenv.config({
    path: path.join(__dirname, `../.env`)
  }).parsed

  const parameters = {
    DeckKey,
    TwitterApiKey,
    TwitterSecretKey,
    TwitterAccessToken,
    TwitterAccessTokenSecret
  }

  const params = {
    StackName: `anki-twitter-bot-cicd`,
    Capabilities: ['CAPABILITY_IAM'],
    Parameters: Object.keys(parameters).map((key) => ({
      ParameterKey: key,
      ParameterValue: parameters[key]
    })),
    TemplateBody
  }
  return params
}

yargs
  .command(
    'create-stack',
    'create cicd stack',
    (yargs) => {},
    () => {
      console.log(`Start creating stack...`)
      cloudformation.createStack(makeParams(), (err, data) => {
        if (err) console.log(err, err.stack)
        else console.log(data)
      })
    }
  )
  .command(
    'update-stack',
    'update cicd stack',
    (yargs) => {},
    () => {
      console.log(`Start updating stack...`)
      cloudformation.updateStack(makeParams(), (err, data) => {
        if (err) console.log(err, err.stack)
        else console.log(data)
      })
    }
  )
  .help().argv
