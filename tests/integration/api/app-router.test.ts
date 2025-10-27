import assert from 'node:assert'
import { Server } from '../../../src/commands/preview/server.ts'
import type { INovelData } from '../../../src/types/bot.ts'
import { readFile } from '../../../src/utils/file.ts'
import test, { after, before, describe } from 'node:test'
import type { FastifyTypedInstance } from '../../../src/lib/fastify.ts'

describe('Test API [app] router', async () => {
  let app!: FastifyTypedInstance

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
        isPublic: false,
        port: 3010,
      },
    })

    app = await server.getInstance()
  })

  after(() => app?.close())

  test('GET /api/health-check should return status OK', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health-check',
    })

    assert.deepEqual(response.statusCode, 200)
    assert.deepStrictEqual(await response.json(), {
      status: 'ok',
    })
  })
})
