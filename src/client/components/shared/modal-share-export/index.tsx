import S from './style.module.css'
import { Modal } from '../modal/index.tsx'
import type { FC } from '../../../types/fc.ts'
import { IconShare, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { SharingView } from './share-views/index.tsx'
import { ExportNovelOption } from './export-novel-option.tsx'

const ShareNovelOption = ({ onOpenShare }: { onOpenShare: () => void }) => {
  return (
    <li onClick={onOpenShare} className={S.item} tabIndex={1}>
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
  const [isSharing, setIsSharing] = useState(false)

  const swapToShareView = () => setIsSharing(true)

  const Overview = () => {
    return (
      <ul className={S.overview}>
        <ShareNovelOption onOpenShare={swapToShareView} />
        <ExportNovelOption format="json" />
        <ExportNovelOption format="epub" />
      </ul>
    )
  }

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
          {isSharing ? (
            <SharingView onBack={() => setIsSharing(false)} />
          ) : (
            <Overview />
          )}
        </Modal.Content>
      </Modal.Wrapper>
    </Modal.Root>
  )
}
