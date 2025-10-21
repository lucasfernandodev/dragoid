import S from './style.module.css'
import { Modal } from '../modal/index.tsx'
import type { FC } from '../../../types/fc.ts'
import { IconCopy, IconShare, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { Button } from '../../atoms/button/index.tsx'
import { useFetch } from '../../../hooks/useFetch.ts'
import { Loading } from '../loading/index.tsx'
import { getNovelShareInfo } from '../../../api/get-novel-share-info.ts'
import { writeToClipboard } from '../../../utils/write-to-clipboard.ts'
import { GenerateLinkError } from './share-views/generate-link-failed.tsx'
import { ServerOffline } from './share-views/server-offline.tsx'
import { ReaderOnlyLocalhost } from './share-views/reader-only-localhost.tsx'

const SharingView = ({ onBack }: { onBack: () => void }) => {
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

const Content = () => {
  const [isSharing, setIsSharing] = useState(false)

  if (isSharing) {
    return <SharingView onBack={() => setIsSharing(false)} />
  }

  return (
    <ul className={S.overview}>
      <li
        className={S.list_item}
        onClick={() => setIsSharing(true)}
        tabIndex={1}
      >
        <div className={S.icon}>
          <div className={S.frame}>
            <IconShare />
          </div>
        </div>
        <div className={S.details}>
          <h3>Share Novel</h3>
          <p>Share the current novel with others via link or QR code</p>
        </div>
      </li>
    </ul>
  )
}

interface IModalShareExportProps {
  isOpen: boolean
  closeModal: () => void
}

export const ModalShareExport: FC<IModalShareExportProps> = ({
  isOpen,
  closeModal,
}) => {
  return (
    <Modal.Root isOpen={isOpen}>
      <Modal.Wrapper className={S.wrapper}>
        <Modal.Header>
          <Modal.HeaderGroup>
            <IconShare />
            <Modal.Title>Export/Share</Modal.Title>
          </Modal.HeaderGroup>
          <Modal.CloseButton onClick={closeModal}>
            <IconX />
          </Modal.CloseButton>
        </Modal.Header>
        <Modal.Content className={S.content}>
          <Content />
        </Modal.Content>
      </Modal.Wrapper>
    </Modal.Root>
  )
}
