const path = require('path')
const fs = require('fs')

const clearDir = (dir) => () => {
  console.log('start cleaning the target directory...')
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    fs.unlinkSync(path.join(dir, file))
  })
  console.log('cleaning completed.')
}

module.exports = {
  clearDir
}
