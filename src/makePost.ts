import * as chromium from 'chrome-aws-lambda'
import { Page } from 'puppeteer'
import { theme as GithubTheme } from './themes/github'
import { Note } from './interfaces'

const makeNoteHtml = (note: Note, theme: string = GithubTheme) => {
  return `
    <html>
      <header>
        <style>
          ${theme}
          #note {
            padding: 4px 20px 20px;
          }
        </style>
      </header>
      <body>
        <div id='note'>${note.content.replace('\u001f', '<hr>')}</div>
      </body>
    </html>
  `
}

const getDomRect = async (selector: string, page: Page) => {
  const rect = await page.evaluate((selector: string) => {
    const el = document.querySelector(selector)
    if (!el) throw new Error('element not found.')
    const { x, y, width, height } = el.getBoundingClientRect()
    return { x, y, width, height }
  }, selector)
  return rect
}

const makePng = async (html: string, dst: string) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 480, height: 3000 })
  await page.setContent(html)
  await page.screenshot({
    path: dst,
    clip: await getDomRect('#note', page)
  })
  await browser.close()
}

export { makeNoteHtml, makePng }
