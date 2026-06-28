import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright-core')
const root = path.resolve(import.meta.dirname, '..')
const output = path.join(root, 'report-assets', 'screenshots')
await mkdir(output, { recursive: true })

const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' })
const errors = []
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
const page = await context.newPage()
page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`) })
page.on('pageerror', (error) => errors.push(`page: ${error.message}`))
await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' })
await page.emulateMedia({ reducedMotion: 'reduce' })

const shot = async (selector, name) => {
  const target = page.locator(selector)
  await target.scrollIntoViewIfNeeded()
  await page.waitForTimeout(120)
  await target.screenshot({ path: path.join(output, name), animations: 'disabled' })
}

await shot('#top', '01-hero.png')
await shot('#idea', '02-idea.png')
await page.getByRole('tab', { name: /Сегодня Современный университет/ }).click()
await shot('#timeline', '03-timeline-active.png')
await shot('#quest', '04-quest-step-1.png')
await page.getByRole('button', { name: /^Проекты/ }).click()
await page.getByRole('button', { name: /Продолжить/ }).click()
await page.getByRole('button', { name: /^Творческая лаборатория/ }).click()
await page.getByRole('button', { name: /Продолжить/ }).click()
await page.getByRole('button', { name: /^Изобретатель/ }).click()
await page.getByRole('button', { name: /Открыть капсулу/ }).click()
await shot('#quest', '05-quest-result.png')
await shot('#crossword', '06-crossword.png')
await page.getByRole('button', { name: /Показать намёк/ }).click()
await page.getByRole('button', { name: /Открыть одну букву/ }).click()
await shot('#crossword', '06b-crossword-hint.png')

const crossword = [
  ['УНИВЕРСИТЕТ', 1, 6, 'down'], ['БУДУЩЕЕ', 1, 5, 'across'], ['ПРИБОР', 3, 4, 'across'],
  ['ПАМЯТЬ', 3, 4, 'down'], ['ПРОЕКТ', 6, 5, 'across'], ['КОД', 5, 7, 'down'], ['ДИЗАЙН', 8, 5, 'across'],
]
const letters = new Map()
for (const [answer, row, col, direction] of crossword) [...answer].forEach((letter, index) => letters.set(`${row + (direction === 'down' ? index : 0)}-${col + (direction === 'across' ? index : 0)}`, letter))
for (const [key, letter] of letters) {
  const [row, col] = key.split('-')
  const input = page.getByLabel(new RegExp(`^Клетка ${row}, ${col}`))
  if (await input.isEditable()) await input.fill(letter)
}
await page.getByRole('button', { name: /Проверить ответы/ }).click()
await shot('#crossword', '07-crossword-complete.png')
await shot('#message', '08-message-form.png')
await page.getByLabel('Ваше имя').fill('Студент МГУПИ')
await page.getByLabel('Направление или группа').fill('Компьютерный дизайн')
await page.getByLabel('Послание будущим студентам').fill('Не бойтесь соединять инженерную точность с воображением — самые сильные проекты рождаются на границе дисциплин.')
await page.getByRole('button', { name: /Сохранить в капсулу/ }).click()
await shot('#message', '09-message-saved.png')
await shot('#gallery', '10-gallery.png')
await shot('#final', '11-final-card.png')

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
const mobilePage = await mobile.newPage()
mobilePage.on('console', (message) => { if (message.type() === 'error') errors.push(`mobile console: ${message.text()}`) })
mobilePage.on('pageerror', (error) => errors.push(`mobile page: ${error.message}`))
await mobilePage.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' })
await mobilePage.emulateMedia({ reducedMotion: 'reduce' })
await mobilePage.locator('#top').screenshot({ path: path.join(output, '12-mobile-hero.png'), animations: 'disabled' })
await mobilePage.locator('#crossword').scrollIntoViewIfNeeded()
await mobilePage.getByRole('button', { name: /Показать намёк/ }).click()
await mobilePage.getByRole('button', { name: /Открыть одну букву/ }).click()
await mobilePage.locator('#crossword').screenshot({ path: path.join(output, '13-mobile-crossword.png'), animations: 'disabled' })

const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
const responsive = []
for (const viewport of [
  { width: 320, height: 720 }, { width: 360, height: 800 }, { width: 390, height: 844 },
  { width: 768, height: 900 }, { width: 1024, height: 900 }, { width: 1440, height: 1000 },
]) {
  const audit = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  const auditPage = await audit.newPage()
  auditPage.on('console', (message) => { if (message.type() === 'error') errors.push(`${viewport.width}px console: ${message.text()}`) })
  auditPage.on('pageerror', (error) => errors.push(`${viewport.width}px page: ${error.message}`))
  await auditPage.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' })
  responsive.push(await auditPage.evaluate(({ width, height }) => ({
    width,
    height,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    sectionIndex: getComputedStyle(document.querySelector('.section-index')).fontSize,
    button: getComputedStyle(document.querySelector('.button')).fontSize,
    clue: getComputedStyle(document.querySelector('.crossword-clues li p')).fontSize,
  }), viewport))
  await audit.close()
}
console.log(JSON.stringify({ screenshots: 14, errors, desktopOverflow, mobileOverflow, responsive }, null, 2))
await browser.close()
