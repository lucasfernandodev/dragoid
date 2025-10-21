import { z } from 'zod'
import { ApplicationError } from '../errors/application-error.ts'
import QRCode from 'qrcode'

const schema = z.string().min(1).max(300)
export class GenerateQRCode {
  private validateContent = (content: unknown): string => {
    const parse = schema.safeParse(content)
    if (!parse.success) {
      throw new ApplicationError(
        `Generate qrcode failed`,
        parse.error.issues.map((issue) => issue.message).join('\n')
      )
    }
    return parse.data
  }

  public toDataURL = async (content: string) => {
    const _content = this.validateContent(content)
    try {
      const data = await QRCode.toDataURL(_content, {
        type: 'image/webp',
        width: 180,
        errorCorrectionLevel: 'H',
      })
      return data
    } catch (error: unknown) {
      throw new ApplicationError((error as Error)?.message, error)
    }
  }
}
