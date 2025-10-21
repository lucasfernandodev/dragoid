import { collectChapterList } from './../../../../src/commands/download/providers/novelbin/collect/chapter-list.ts'
import { logger } from './../../../../src/utils/logger.ts'
import { testPages } from './../../../pages.ts'
import { TEST_ASSETS_HTML_PATH } from './../../../../src/core/configurations.ts'
import fs from 'node:fs/promises'
import { describe, it } from 'node:test'
import assert from 'node:assert'
import { load } from 'cheerio'

describe('NovelBin - Extract the list of chapters from an html', async () => {
  const path = TEST_ASSETS_HTML_PATH
  const filename = testPages['novelbin-chapterList'].targetName
  const content = await fs.readFile(`${path}/${filename}.html`, 'utf-8')

  if (content.includes('cloudflare')) {
    logger.info('Cloudflare page, skip testes')
    return
  }

  it('Should return a non-empty array', () => {
    const result = collectChapterList(content)
    assert.ok(Array.isArray(result))
    assert.ok(result.length >= 1)
  })

  it('Should throw if chapter list empty', () => {
    const $ = load(content)
    $('.list-chapter li a').each((_, el) => {
      const link = $(el)
      link.removeAttr('href')
    })

    assert.throws(() => collectChapterList($.html()))
  })
})
