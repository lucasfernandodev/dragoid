import { Link, useNavigate } from 'react-router-dom';
import S from './style.module.css';
import { IconList } from '@tabler/icons-react';
import { ModalChapterList } from '../modal-chapter-list/index.tsx';
import { useState } from 'react';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut.tsx';

interface ChapterNavigationProps {
  prev: null | number;
  next: null | number;
  chapterId: number
}

export const ChapterNavigation = ({ prev, next, chapterId }: ChapterNavigationProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  useKeyboardShortcut(
    () => navigate(`/chapter/?id=${prev}`),
    { code: 'ArrowLeft' }
  )

  useKeyboardShortcut(
    () => navigate(`/chapter/?id=${next}`),
    { code: 'ArrowRight' }
  )

  return (
    <ul className={S.navigation}>
      <li className={S.item}>
        <Link data-disabled={prev === null} to={`/chapter/?id=${prev}`}>
          Back
        </Link>
      </li>
      <li className={S.item}>
        <button className={S.button} onClick={() => setIsOpen(true)}>
          <IconList />
        </button>
        <ModalChapterList
          id={chapterId}
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
        />
      </li>
      <li className={S.item}>
        <Link data-disabled={next === null} to={`/chapter/?id=${next}`}>
          Next
        </Link>
      </li>
    </ul>
  )
}