import os from 'node:os'
import fs from 'node:fs/promises'
import type { FastifyTypedInstance } from '../../../../lib/fastify.ts'
import { ApplicationError } from '../../../../errors/application-error.ts'
import { GenerateEpubService } from '../../../../services/generate-epub.ts'
import path from 'node:path'
import { safeReadFile } from '../../../../utils/io.ts'
import { logger } from '../../../../utils/logger.ts'
import { downloadNovelRouteSchema } from './download-novel.schema.ts'

export const downloadNovelRouter = async (app: FastifyTypedInstance) => {
  app.get(
    '/api/novel/download',
    downloadNovelRouteSchema,
    async (req, reply) => {
      if (!app?.novel) {
        throw new ApplicationError(
          'Chapters cannot be retrieved because novel data is not loaded.\
        Ensure that the novel file was successfully parsed before accessing this route.'
        )
      }

      const { format } = req.query

      if (format === 'json') {
        const filename = `${app.novel.title}.json`
        const jsonString = JSON.stringify(app.novel, null, 2)

        return reply
          .header('Content-Type', 'application/json')
          .header('Content-Disposition', `attachment; filename="${filename}"`)
          .send(jsonString)
      }

      if (format === 'epub') {
        const filename = `${app.novel.title}`
        const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'epub-'))
        const outPath = path.join(tmpDir, `${filename}.epub`)

        const service = new GenerateEpubService()

        await service.execute({
          filename,
          novel: app.novel,
          title: app.novel.title,
          outputFolder: tmpDir,
        })

        const {
          isSuccess,
          data: epubBuffer,
          error,
        } = await safeReadFile<string>(outPath)

        await fs.unlink(outPath)
        await fs.rmdir(tmpDir)

        if (!isSuccess) {
          logger.error(error.message, error)
          return reply.code(400).send({
            success: false,
            error: {
              title: 'Error generating file',
              message: 'Unable to create download file.',
            },
          })
        }

        return reply
          .header('Content-Type', 'application/epub+zip')
          .header('Content-Disposition', `attachment; filename="${filename}"`)
          .send(epubBuffer)
      }
    }
  )
}
