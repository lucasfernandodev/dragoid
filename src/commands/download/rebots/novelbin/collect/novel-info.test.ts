import fs from 'node:fs/promises';
import { describe, it } from "node:test";
import { TEST_ASSETS_HTML_PATH } from '../../../../../core/configurations.ts';
import { testPages } from '../../../../../../tests/pages.ts';
import { collectNovelInfo } from './novel-info.ts';
import assert from 'node:assert';
import { load } from 'cheerio';

describe('NovelBin - Test parse html information from the novel', async () => {
  const path = TEST_ASSETS_HTML_PATH
  const filename = testPages['novelbin-novel'].targetName
  const content = await fs.readFile(`${path}/${filename}.html`, 'utf-8');


  it('Should retrieve the novel information correctly.', () => {
    const meta = {
      "thumbnail": "https://novelbin.com/media/novel/my-house-of-horrors.jpg",
      "language": "English",
      "chapterList": "https://novelbin.com/ajax/chapter-archive?novelId=my-house-of-horrors",
      "title": "My House of Horrors",
      "description": [
        "The hearse with the weird odor slowed to a stop before the entrance. The sound of pebbles could be heard bouncing on the ceiling.",
        "There were footsteps coming from the corridor, and there seemed to be someone sawing next door.",
        "The door knob to the room rattled slightly, and the faucet in the bathroom kept dripping even though it had been screwed shut.",
        "There was a rubber ball that rolled on its own underneath the bed.",
        "Wet footsteps started to surface one after another on the floor.",
        "At 3 am, Chen Ge held a cleaver in his hand as he hid beside the room heater.",
        "The call he was trying to make was finally answered.",
        "“Landlord, is this what you meant by ‘the house can be a little crowded at night’!?”"
      ],
      "genres": [
        "action",
        "adventure",
        "horror",
        "mature",
        "mystery",
        "seinen",
        "supernatural"
      ],
      "author": [
        "I Fix Air-conditioner"
      ],
      "status": "Completed"
    }

    const expectedMeta = collectNovelInfo(content)
    assert.deepStrictEqual(meta, expectedMeta);
  })

  it('Must return a valid title that is not empty', () => {
    const result = collectNovelInfo(content)
    assert.ok(typeof result.title !== 'undefined' && result.title.length > 0)
  })

  it('Should throw when the title is not found.', () => {
    const $ = load(content);
    // Delete title
    $('h3.title[itemprop="name"]').first().remove()
    assert.throws(() => collectNovelInfo($.html()));
  })
})