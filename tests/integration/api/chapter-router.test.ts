import test, { after, before, describe } from 'node:test'
import type { INovelData } from '../../../src/types/bot.ts'
import type { FastifyTypedInstance } from '../../../src/lib/fastify.ts'
import { readFile } from '../../../src/utils/file.ts'
import { Server } from '../../../src/commands/preview/server.ts'
import { hashString } from '../../../src/utils/hash-string.ts'
import assert from 'node:assert'

describe('Test API [chapter] router', async () => {
  let app!: FastifyTypedInstance
  let file!: INovelData

  before(async () => {
    const novel = await readFile<INovelData>(
      './tests/assets/novel-example.json'
    )

    const server = new Server({
      files: {
        novel: novel,
        chapter: null,
      },
      opt: {
        isPublic: true,
        port: 3010,
      },
    })

    app = await server.getInstance()
    file = novel
  })

  after(() => app?.close())

  test('GET /api/chapter/:id with valid chapter id should return the chapter details with navigation info', async () => {
    const chapter = file.chapters[0]
    const response = await app.inject({
      method: 'GET',
      url: '/api/chapter/?id=0',
    })

    const expectResponse = {
      success: true,
      chapter: {
        novelTitle: file.title,
        title: chapter.title,
        content: chapter.content.map((ph, i) => ({
          id: hashString(ph + i),
          paragraph: ph,
        })),
        chapter_prev_id: null,
        chapter_next_id: 1,
      },
    }

    assert.deepEqual(response.statusCode, 200)
    assert.deepStrictEqual(await response.json(), expectResponse)
  })

  test('GET /api/chapter/:id with not found chapter id should return error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/chapter/?id=19990',
    })

    assert.deepEqual(response.statusCode, 404)
    assert.deepStrictEqual(await response.json(), {
      success: false,
      error: {
        message: 'Chapter not found',
      },
    })
  })

  test('GET /api/chapter should return chapter list', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/chapter',
    })

    const expect = {
      success: true,
      title: file.title,
      chapterList: file.chapters.map((ch, i) => ({ id: i, title: ch.title })),
    }

    assert.deepEqual(response.statusCode, 200)
    assert.deepStrictEqual(await response.json(), expect)
  })
})
