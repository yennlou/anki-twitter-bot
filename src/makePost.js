const path = require('path')
const chromium = require('chrome-aws-lambda')

const makePng = async (html) => {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless
  })
  const page = await browser.newPage()
  await page.setViewport({
    width: 960,
    height: 760,
    deviceScaleFactor: 1
  })
  await page.setContent(html)
  await page.screenshot({ path: path.join(__dirname, 'posts/anki.png') })
  await browser.close()
}

const main = () => {
  makePng('<h1>Hello world</h1>')
}

main()
