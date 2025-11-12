import type { FastifyInstance } from 'fastify'
import { getLocalIPAddress } from '../../../../utils/get-local-ip.ts'
import { z } from 'zod'
import { GenerateQRCode } from '../../../../services/generate-qrcode.ts'
import { getNovelShareInfoRouteSchema } from './get-novel-share-info.schema.ts'

export const getNovelShareInfo = async (app: FastifyInstance) => {
  app.get('/api/share', getNovelShareInfoRouteSchema, async (_, reply) => {
    const protocol = 'http'

    if (!app.isPublic) {
      return reply.send({
        success: true,
        data: {
          isPublic: false,
          message:
            'The reader is only available on this device. To enable access on other devices on the local network, start the server with the --public (or -p) option.',
        },
      })
    }

    const ip = getLocalIPAddress()
    const validateIp = z.ipv4().safeParse(ip)
    const port = app.addresses()[0]?.port

    if (!validateIp.success) {
      return reply.code(500).send({
        success: false,
        error: {
          title: 'Error generating link',
          message: `Validation Error: ${validateIp.error.issues[0].message}`,
        },
      })
    }

    if (typeof port !== 'number') {
      return reply.code(500).send({
        success: false,
        error: {
          title: 'Error generating link',
          message: `Server configuration error: invalid port value (${String(port)})`,
        },
      })
    }

    const url = new URL(`${protocol}://${ip}:${port}`)
    const generateQRCode = new GenerateQRCode()
    const dataURL = await generateQRCode.toDataURL(url.toString())
    return reply.send({
      success: true,
      data: {
        isPublic: true,
        host: url.toString(),
        qrcode: dataURL,
      },
    })
  })
}
