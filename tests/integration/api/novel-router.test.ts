import test, { after, before, describe } from 'node:test'
import type { FastifyTypedInstance } from '../../../src/lib/fastify.ts'
import type { INovelData } from '../../../src/types/bot.ts'
import { readFile } from '../../../src/utils/file.ts'
import { Server } from '../../../src/commands/preview/server.ts'
import assert from 'node:assert'

describe('Test API [novel] router', async () => {
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

  test('GET /api/novel should return novel properties', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/novel',
    })

    const expectedResponse = {
      success: true,
      novel: {
        title: file.title,
        sinopse: file.description,
        source: file.source,
        thumbnail: file.thumbnail,
        language: file.language,
        qtdChapters: file.chapters.length,
        status: file.status,
      },
    }

    assert.deepEqual(response.statusCode, 200)
    assert.notDeepEqual(await response.json(), expectedResponse)
  })
})
