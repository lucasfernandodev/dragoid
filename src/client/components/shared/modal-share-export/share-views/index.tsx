import S from '../style.module.css'
import { IconCopy } from '@tabler/icons-react'
import { getNovelShareInfo } from '../../../../api/get-novel-share-info.ts'
import { useFetch } from '../../../../hooks/useFetch.ts'
import { writeToClipboard } from '../../../../utils/write-to-clipboard.ts'
import { Button } from '../../../atoms/button/index.tsx'
import { Loading } from '../../loading/index.tsx'
import { GenerateLinkError } from './generate-link-failed.tsx'
import { ReaderOnlyLocalhost } from './reader-only-localhost.tsx'
import { ServerOffline } from './server-offline.tsx'

export const SharingView = ({ onBack }: { onBack: () => void }) => {
  let timer: ReturnType<typeof setTimeout>

  const { isLoading, data, success } = useFetch({
    queryKey: ['getShareInfo'],
    queryFn: getNovelShareInfo,
  })

  if (isLoading) {
    return <Loading />
  }

  // Server error
  if (!success) {
    return <ServerOffline onBack={onBack} />
  }

  // Error generating link
  if (!data?.success && !data?.data && data?.error) {
    return (
      <GenerateLinkError
        message={data?.error?.message}
        title={data?.error?.title}
        onBack={onBack}
      />
    )
  }

  // User using only localhost
  if (data?.success && !data.data?.isPublic) {
    return (
      <ReaderOnlyLocalhost
        message={data?.data?.message || ''}
        onBack={onBack}
      />
    )
  }

  const copyReaderUrl = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const host = data?.data.host

    if (!host) return

    const btn = ev.currentTarget as HTMLButtonElement
    const span = btn.querySelector('span')

    try {
      await writeToClipboard(host)
      if (!span) return
      const oldText = span.textContent
      span.innerText = `Copied! 🎉`
      clearTimeout(timer)
      timer = setTimeout(() => {
        span.innerText = oldText || ''
      }, 800)
    } catch (error) {
      console.error('Copy host failed:')
      console.error(error)
    }
  }

  return (
    <div className={S.share}>
      <div className={S.qrcode}>
        <img src={data?.data?.qrcode || ''} alt="qrcode" />
        <p>
          Scan this QR code to access the novel in others devices in same
          network
        </p>
      </div>
      <div className={S.group_button}>
        <Button onClick={copyReaderUrl}>
          <IconCopy />
          <span>Copy Link</span>
        </Button>
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  )
}
