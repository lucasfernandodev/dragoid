import fs from 'node:fs/promises';
import { describe, it } from "node:test";
import { TEST_ASSETS_HTML_PATH } from "../../../configurations.ts";
import assert from 'node:assert';
import { load } from 'cheerio';
import { collectChapter } from './chapter.ts';
import { testPages } from '../../../../../tests/assets/pages.ts';

describe('69shuba - Test collect content from chapter', async () => {
  const path = TEST_ASSETS_HTML_PATH
  const filename = testPages['69shuba-chapter'].targetName
  const content = await fs.readFile(`${path}/${filename}.html`, 'utf-8');

  it('Should throw when the title is not found', async () => {
    const $ = load(content);
    // Delete title
    $('h1').first().remove()
    assert.throws(() => collectChapter($.html()));
  })

  it('Should extract at least one paragraph from the content', async () => {
    const chapter = collectChapter(content)
    assert.ok(chapter.content.length >= 1);
  })

  it('Should throw if the chapter content is empty', async () => {
    const $ = load(content);
    const containerParagraphs = $('.txtnav').first()
    const nodes = containerParagraphs.contents();
    nodes.each((_, el) => {
      $(el).remove()
    })

    assert.throws(() => collectChapter($.html()))
  })
})