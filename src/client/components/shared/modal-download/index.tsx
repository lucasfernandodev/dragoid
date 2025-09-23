import { IconBook2, IconDownload, IconFileDescription, IconX } from '@tabler/icons-react';
import { Modal } from '../modal/index.tsx';
import S from './style.module.css';
import type { FC } from '../../../../types/front-end/fc.ts';
import type { IBookLibrary } from '../../molecules/library-book/index.tsx';
import { useBrowserLibraryManager } from '../../../hooks/library-offline-manager.ts';
import { _fetch } from '../../../utils/fetch.ts';
import { useState } from 'react';
import { Loading } from '../loading/index.tsx';

interface ModalDownloadProps {
  isOpen: boolean;
  closeModal: () => void,
  book: IBookLibrary
}

const ButtonCacheBook = ({ onSubmit, isLoading }: { isLoading: boolean, onSubmit: () => void }) => {
  return (
    <button className={S.btn_add} onClick={onSubmit}>
      {isLoading ? <Loading /> : 'Download'}
    </button>
  )
};

const ButtonDeleteCacheBook = ({ onSubmit, isLoading }: { isLoading: boolean, onSubmit: () => void }) => {
  return (
    <button className={S.btn_delete} onClick={onSubmit}>
      {isLoading ? <Loading /> : 'Delete'}
    </button>
  )
}

export const ModalDownload: FC<ModalDownloadProps> = ({
  isOpen,
  closeModal,
  book
}) => {

  const { addBook, removeBook } = useBrowserLibraryManager()
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const deleteBook = async () => {
    setIsDeleteLoading(true);
    const result = await removeBook(book.title);
    if (!result.success) {
      console.log('Delete cached book error: ', result.error.message)
    }
    setIsDeleteLoading(false);
  }

  const registerBook = async () => {
    setIsRegisterLoading(true)
    try {
      const response = await _fetch('/api/novel/full');
      const data = await response.json();
      if (!data || !data.novel) {
        console.error("Retrieve Book to save offline failed", response)
      }

      const result = await addBook(data.novel);
      if (!result.success) {
        console.error('Register book failed', result.error.message)
      }

    } catch (error) {
      console.error("Register Book Failed", error)
    } finally {
      setIsRegisterLoading(false)
    }
  }

  return (
    <Modal.Root isOpen={isOpen}>
      <Modal.Wrapper className={S.modal_wrapper}>
        <Modal.Header>
          <Modal.Title className={S.title}>
            <IconDownload />
            <span>Download Options</span>
          </Modal.Title>
          <Modal.CloseButton onClick={closeModal}>
            <IconX />
          </Modal.CloseButton>
        </Modal.Header>
        <Modal.Content className={S.modal_content}>
          <div className={S.book_card}>
            <div className={S.thumbnail}>
              <img src={`data:image/jpeg;base64,${book.thumbnail}`} alt="" />
            </div>
            <div className={S.info}>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          </div>
          <h3 className={S.section_title}>For Offline Reading</h3>
          <div className={S.section_offline_action}>
            <div className={S.action}>
              <h3>
                <IconBook2 />
                <span>Cache in browser</span>
              </h3>
              {book.isOfflineStored ? <ButtonDeleteCacheBook
                isLoading={isDeleteLoading}
                onSubmit={deleteBook}
              /> : <ButtonCacheBook
                onSubmit={registerBook}
                isLoading={isRegisterLoading}
              />}
            </div>
            <p className={S.description}>
              Download the book to your browser and read offline.
            </p>
          </div>
          <h3 className={S.section_title}>Download as file</h3>
          <div className={S.download_option}>
            <div className={S.icon}>
              <IconFileDescription />
            </div>
            <div className={S.info}>
              <h3>JSON</h3>
              <p>json format</p>
            </div>
            <button className={S.btn_download}>
              Download
            </button>
          </div>
        </Modal.Content>
      </Modal.Wrapper>
    </Modal.Root>
  )
}