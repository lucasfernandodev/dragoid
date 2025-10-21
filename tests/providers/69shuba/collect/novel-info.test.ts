import { collectNovelInfo } from './../../../../src/commands/download/providers/69shuba/collect/novel-info.ts'
import fs from 'node:fs/promises'
import { describe, it } from 'node:test'
import assert from 'node:assert'
import { load } from 'cheerio'
import { TEST_ASSETS_HTML_PATH } from '../../../../src/core/configurations.ts'
import { testPages } from '../../../pages.ts'

describe('69shuba - Test parse html information from the novel', async () => {
  const path = TEST_ASSETS_HTML_PATH
  const filename = testPages['69shuba-novel'].targetName
  const content = await fs.readFile(`${path}/${filename}.html`, 'utf-8')

  it('Should retrieve the novel information correctly.', () => {
    const meta = {
      title: '神圣罗马帝国',
      author: ['新海月1', '历史军事'],
      description: [
        '一部奥地利的复兴之路，一部哈布斯堡家族的奋斗史！！！',
        '既不神圣，也不罗马，更不帝国的神圣罗马帝国复兴了！！！',
        '已完本老书《地中海霸主之路》，新书《逐道在诸天》，欢迎大家加入。',
        '欢迎加入新海月1书友群，群聊号码：688510445',
        '（本故事纯属虚构，揭露帝国主义黑历史）',
      ],
      genres: ['历史军事'],
      status: '全本',
      language: 'Chinese',
      thumbnail:
        'https://static.69shuba.com/files/article/image/30/30539/30539s.jpg',
      chapterList: 'https://www.69shuba.com/book/30539/',
    }

    const expectedMeta = collectNovelInfo(content)
    assert.deepStrictEqual(meta, expectedMeta)
  })

  it('Must return a valid title that is not empty', () => {
    const result = collectNovelInfo(content)
    assert.ok(typeof result.title !== 'undefined' && result.title.length > 0)
  })

  it('Should throw when the title is not found.', () => {
    const $ = load(content)
    // Delete title
    $('.booknav2 h1 a').first().remove()
    assert.throws(() => collectNovelInfo($.html()))
  })
})
