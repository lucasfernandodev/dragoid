/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it } from 'node:test'
import { GenerateQRCode } from './generate-qrcode.ts'
import assert from 'node:assert'

function isValidDataURL(str: string) {
  const regex =
    // eslint-disable-next-line no-useless-escape
    /^\s*data:([a-z]+\/[a-z0-9\-\+\.]+)?(;charset=[a-z0-9\-]+)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i
  return regex.test(str)
}

describe('Test QRCode Generate', async () => {
  it('should failed when content is undefined or null', async () => {
    const service = new GenerateQRCode()
    assert.rejects(async () => await service.toDataURL(null as any))
    assert.rejects(async () => await service.toDataURL(undefined as any))
  })
  it('Should be success when content is a valid link', async () => {
    const service = new GenerateQRCode()
    assert.doesNotReject(
      async () => await service.toDataURL('http://127.0.0.1:3010')
    )
    assert.deepEqual(
      isValidDataURL(await service.toDataURL('http://127.0.0.1:3010')),
      true
    )
  })
})
