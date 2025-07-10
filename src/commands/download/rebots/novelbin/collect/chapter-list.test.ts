import fs from 'node:fs/promises';
import { describe, it } from "node:test";
import { testPages } from "../../../../../../tests/pages.ts";
import { TEST_ASSETS_HTML_PATH } from '../../../../../core/configurations.ts';
import { collectChapterList } from './chapter-list.ts';
import assert from 'node:assert';
import { load } from 'cheerio';

describe('NovelBin - Test parse html chapter list', async () => {
  const path = TEST_ASSETS_HTML_PATH
  const filename = testPages['novelbin-chapterList'].targetName
  const content = await fs.readFile(`${path}/${filename}.html`, 'utf-8');

  it('Should return at least one chapter', () => {
    const result = collectChapterList(content);
    assert.ok(result.length >= 1)
  })

  it('Should throw if chapter list empty', () => {
    const $ = load(content)
    $('.list-chapter li a').each((_, el) => {
      const link = $(el);
      link.removeAttr('href')
    })

    assert.throws(() => collectChapterList($.html()))
  })
})