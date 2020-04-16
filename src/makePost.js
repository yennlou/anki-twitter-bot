const path = require('path')
const chromium = require('chrome-aws-lambda')
const GithubTheme = require('./themes/github')

const NOTE_1 = '<h3>Explain event delegation</h3>\u001f<div>Event delegation is a technique ' +
'involving adding event listeners to a parent element instead of adding ' +
'them to the descendant elements. The listener will fire whenever the ' +
'event is triggered on the descendant elements due to event bubbling up ' +
'the DOM. The benefits of this technique are:</div><ul><li>Memory ' +
'footprint goes down because only one single handler is needed on the ' +
'parent element, rather than having to attach event handlers on each ' +
'descendant.</li><li>There is no need to unbind the handler from ' +
'elements that are removed and to bind the event for new ' +
'elements.</li></ul>'

const makeHtml = (note, theme = GithubTheme) => {
  return `
    <html>
      <header>
        <style>
          ${theme}
        </style>
      </header>
      <body>
        <div>${note.replace('\u001f', '')}</div>
      </body>
    </html>
  `
}

const makePng = async (html, dstDir) => {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath
  })
  const page = await browser.newPage()
  await page.setViewport({
    width: 480,
    height: 960
  })
  await page.setContent(html)
  await page.screenshot({ path: path.join(dstDir, 'anki.png') })
  await browser.close()
}

const main = () => {
  const dstDir = path.join(__dirname, 'posts')
  makePng(makeHtml(NOTE_1), dstDir)
}

main()
