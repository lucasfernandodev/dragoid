import fs from 'node:fs/promises';
import { describe, it } from "node:test";
import { TEST_ASSETS_HTML_PATH } from "../../../../../core/configurations.ts";
import { testPages } from "../../../../../../tests/pages.ts";
import { collectNovelInfo } from './novel-info.ts';
import assert from 'node:assert';
import { load } from 'cheerio';

describe('ReadNovelFull - Test parse html information from the novel', async () => {
  const path = TEST_ASSETS_HTML_PATH
  const filename = testPages['readnovelfull-novel'].targetName
  const content = await fs.readFile(`${path}/${filename}.html`, 'utf-8');

  it('Should retrieve the novel information correctly.', () => {
    const meta = {
      "language": "english",
      "thumbnail": "https://img.readnovelfull.com/thumb/t-300x439/Ancient-Godly-Monarch-UO7LThI0Am.jpg",
      "title": "Ancient Godly Monarch",
      "description": [
        "In the Province of the Nine Skies, far above the heavens, there exists Nine Galaxies of Astral Rivers made up of countless constellations interwoven together.",
        "For Martial Cultivators, they could form an innate link with one of the constellations, awaken their Astral Soul, and transform into a Stellar Martial Cultivator.",
        "Legend has it that, the strongest cultivators in the Province of the Nine Skies, were beings that could open an astral gate every time they advanced into a new realm. Their talent in cultivation was such that they could even establish innate links with constellations that existed in a layer higher than the Nine Layers of Heavens, eventually transforming into the heaven-defying and earth-shattering power known as the War God of the Nine Heavens.",
        "Qin Wentian is the MC of this story. How could a guy, with a broken set of meridians, successfully cultivate? There were countless Stellar Martial Cultivators, as there were countless constellations in the vast starry skies. What he wanted to be, was the brightest constellation of all, shining dazzlingly in the vast starry skies."
      ],
      "genres": [
        "action",
        "adventure",
        "drama",
        "fantasy",
        "harem",
        "martial+arts",
        "psychological",
        "xuanhuan"
      ],
      "author": [
        "Jing Wu Hen",
        "净无痕"
      ],
      "status": "completed",
      "chapterList": "https://readnovelfull.com/ajax/chapter-archive?novelId=80"
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
    $('.desc h3.title[itemprop="name"]').first().remove()
    assert.throws(() => collectNovelInfo($.html()));
  })
})