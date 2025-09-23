import { IconBolt, IconBook, IconBook2, IconDownload, IconWifiOff } from '@tabler/icons-react';
import S from './style.module.css';
import type { FC } from '../../../../types/front-end/fc.ts';
import type { INovel } from '../../templates/homepage/default/index.tsx';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { LOCAL_STORAGE_KEYS } from '../../../consts/local-storage.ts';

export interface IBookLibrary extends INovel {
  isOfflineStored: boolean;
  isCurrentOpen: boolean
}

interface LibraryBookProps {
  book: IBookLibrary;
  onDownloadOpen: (title: string) => void
}

export const LibraryBook: FC<LibraryBookProps> = ({
  book,
  onDownloadOpen
}) => {
  const navigate = useNavigate()
  const buttonOpenModalRef = useRef<HTMLButtonElement>(null)
  const startRead = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const el = e.target as HTMLElement;
    if (!el || !buttonOpenModalRef.current) return;
    if (el.classList.contains(S.btn_download)) return;
    if (buttonOpenModalRef.current.contains(el)) return;
    navigate("/")

    window.localStorage.setItem(LOCAL_STORAGE_KEYS.currentNovelReading, book.title)
  }

  return (
    <li className={S.book} onClick={startRead}>
      <div className={S.thumbnail}>
        <div className={S.inner_read_placeholder}>
          <p>
            <IconBook />
            <span>Read now</span>
          </p>
        </div>
        <div className={S.inner_thumbnail}>
          <img src={`data:image/jpeg;base64,${book.thumbnail}`} alt={book.title} />
        </div>
        <div className={S.statusBar}>
          {book.isOfflineStored && <div className={S.status}>
            <IconWifiOff />
            <span>offline</span>
          </div>}
          {book.isCurrentOpen && <div className={S.open_status}>
            <IconBolt />
            <span>Active</span>
          </div>}
        </div>
      </div>
      <div className={S.info}>
        <h3 className={S.title}>{book.title}</h3>
        <p className={S.author}>{book.author}</p>
        <div className={S.group}>
          <p className={S.pages}>
            <span>{book.qtdChapters}</span>
            <span>pages</span>
          </p>
          <button
            ref={buttonOpenModalRef}
            className={S.btn_download}
            onClick={() => onDownloadOpen(book.title)}
          >
            <IconDownload />
          </button>
        </div>
      </div>
    </li>
  )
}