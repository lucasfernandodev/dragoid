import S from './style.module.css';
import type { FC } from "../../../../types/front-end/fc.ts";
import { LibraryBook, type IBookLibrary } from '../../molecules/library-book/index.tsx';
import { ModalDownload } from '../../shared/modal-download/index.tsx';
import { useCallback, useState } from 'react';

interface LibraryListProps {
  books: IBookLibrary[]
}

export const LibraryList: FC<LibraryListProps> = ({ books }) => {

  const [selectTitle, setSelectTitle] = useState<null | string>(null)

  const closeModal = useCallback(() => setSelectTitle(null), []);
  const openBookDownloadModal = useCallback((title: string) => {
    setSelectTitle(title)
  }, [])

  const book = selectTitle ? books.find(b => b.title === selectTitle) : undefined;
  const isOpen = !!selectTitle;

  return (
    <ul className={S.library_list}>
      {books.map(book => <LibraryBook key={book.title} book={book} onDownloadOpen={openBookDownloadModal} />)}
      {book && <ModalDownload isOpen={isOpen} closeModal={closeModal} book={book} />}
    </ul>
  )
}