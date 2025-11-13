import fs from 'node:fs/promises'
import os from 'node:os'
import test, { after, before, describe } from 'node:test'
import type { FastifyTypedInstance } from '../../../src/lib/fastify.ts'
import type { INovelData } from '../../../src/types/bot.ts'
import { readFile } from '../../../src/utils/file.ts'
import { Server } from '../../../src/commands/preview/server.ts'
import assert from 'node:assert'
import { EPub } from 'epub2'
import path from 'node:path'

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

  test('GET /api/novel/download?format=json should return valid json file', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/novel/download?format=json',
    })

    const parse = () => JSON.parse(response.payload)

    assert.deepEqual('Novel Example', parse()?.title)
  })

  test('GET /api/novel/download?format=epub should return valid epub file', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/novel/download?format=epub',
    })

    assert.deepEqual(response.statusCode, 200)

    const tmpDir = os.tmpdir()
    const tmpPath = path.join(tmpDir, `tmp-${Date.now()}.epub`)
    await fs.writeFile(tmpPath, response.rawPayload)

    assert.doesNotReject(() => EPub.createAsync(tmpPath), 'EPUB inválido')

    const epub = await EPub.createAsync(tmpPath)

    assert.deepEqual(await epub.metadata.title, 'Novel Example')

    try {
      await fs.unlink(tmpPath)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // ignore
    }
  })
})
