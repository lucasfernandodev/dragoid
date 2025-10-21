import { collectChapter } from './../../../../src/commands/download/providers/readnovelfull/collect/chapter.ts'
import fs from 'node:fs/promises'
import { describe, it } from 'node:test'
import { load } from 'cheerio'
import assert from 'node:assert'
import { TEST_ASSETS_HTML_PATH } from '../../../../src/core/configurations.ts'
import { testPages } from '../../../pages.ts'

describe('ReadNovelFull - Test parse html content from chapter', async () => {
  const path = TEST_ASSETS_HTML_PATH
  const filename = testPages['readnovelfull-chapter'].targetName
  const content = await fs.readFile(`${path}/${filename}.html`, 'utf-8')

  it('Should throw when the title is not found', () => {
    const $ = load(content)
    // Delete title
    $('.chr-title span').first().remove()
    assert.throws(() => collectChapter($.html()))
  })

  it('Should extract at least one paragraph from the content', async () => {
    const chapter = collectChapter(content)
    assert.ok(chapter.content.length >= 1)
  })

  it('Should throw if the chapter content is empty', async () => {
    const $ = load(content)
    $('#chr-content p').each((_, el) => {
      $(el).remove()
    })

    assert.throws(() => collectChapter($.html()))
  })
})
