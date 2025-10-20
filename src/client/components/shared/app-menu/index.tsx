import { useNavigate } from 'react-router-dom';
import S from './style.module.css';
import { IconAB2, IconChevronLeft, IconChevronRight, IconList, IconPalette, IconShare } from '@tabler/icons-react';
import { ModalChapterList } from '../modal-chapter-list/index.tsx';
import { useState } from 'react';
import { FloatMenu } from '../float-menu/index.tsx';
import { useChapterStyle } from '../../../hooks/useChapterStyle.tsx';
import { ModalTextReplacement } from '../modal-text-replacement/index.tsx';
import { ModalShareExport } from '../modal-share-export/index.tsx';

interface AppMenuProps {
  next: number | null;
  prev: number | null;
  target: {
    current: HTMLElement | null
  },
  chapterId?: number
}

export const AppMenu = ({
  chapterId,
  next,
  prev,
  target
}: AppMenuProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const navigate = useNavigate()
  const { openModal } = useChapterStyle()

  const openChapterListModal = () => {
    setActiveModal('chapter-list')
  }

  const openModalShareExport = () => {
    setActiveModal('modal-share-export')
  }

  const openReplacementModal = () => {
    setActiveModal('modal-replacement')
  }

  const closeModal = () => {
    console.log(`Close ${activeModal} Modal!`)
    setActiveModal(null)
  }

  return (
    <FloatMenu target={target}>
      <ul className={S.options}>
        <li className={S.option}>
          <button data-enabled={!!prev} className={S.button} onClick={() => navigate(`/chapter/?id=${prev}`)}>
            <IconChevronLeft />
          </button>
        </li>
        <li className={S.option}>
          <button className={S.button} onClick={openReplacementModal}>
            <IconAB2 />
          </button>
          <ModalTextReplacement
            isOpen={activeModal === 'modal-replacement'}
            closeModal={closeModal}
          />
        </li>
        {typeof chapterId !== 'undefined' && <li className={S.option}>
          <button className={S.button} onClick={openChapterListModal}>
            <IconList />
          </button>
          <ModalChapterList
            id={chapterId}
            isOpen={activeModal === 'chapter-list'}
            closeModal={closeModal}
          />
        </li>}
        <li className={S.option}>
          <button className={S.button} onClick={openModal}>
            <IconPalette />
          </button>
        </li>
        {typeof chapterId !== 'undefined' && <li className={S.option}>
          <button className={S.button} onClick={openModalShareExport}>
            <IconShare />
          </button>
          <ModalShareExport
            isOpen={activeModal === 'modal-share-export'}
            closeModal={closeModal}
          />
        </li>}
        <li className={S.option}>
          <button data-enabled={!!next} className={S.button} onClick={() => navigate(`/chapter/?id=${next}`)}>
            <IconChevronRight />
          </button>
        </li>
      </ul>
    </FloatMenu>
  )
}