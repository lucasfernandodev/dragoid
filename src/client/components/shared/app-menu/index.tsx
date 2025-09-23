import { useNavigate } from 'react-router-dom';
import S from './style.module.css';
import { IconAB2, IconBooks, IconChevronLeft, IconChevronRight, IconList, IconPalette } from '@tabler/icons-react';
import { ModalChapterList } from '../modal-chapter-list/index.tsx';
import { useState } from 'react';
import { FloatMenu } from '../float-menu/index.tsx';
import { useChapterStyle } from '../../../hooks/useChapterStyle.tsx';
import { ModalReplacementList } from '../modal-replacement-list/index.tsx';

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

  const openReplacementModal = () => {
    setActiveModal('modal-replacement')
  }

  const closeModal = () => setActiveModal(null)

  return (
    <FloatMenu target={target}>
      <ul className={S.options}>
        <li className={S.option}>
          <button data-enabled={!!prev} className={S.button} onClick={() => navigate(`/chapter/?id=${prev}`)}>
            <IconChevronLeft />
          </button>
        </li>
        <div className={S.option}>
          <button className={S.button} onClick={() => navigate('/library')}>
            <IconBooks />
          </button>
        </div>
        <li className={S.option}>
          <button className={S.button} onClick={openReplacementModal}>
            <IconAB2 />
          </button>
          <ModalReplacementList
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
        <li className={S.option}>
          <button data-enabled={!!next} className={S.button} onClick={() => navigate(`/chapter/?id=${next}`)}>
            <IconChevronRight />
          </button>
        </li>
      </ul>
    </FloatMenu>
  )
}