import { IconArrowBack, IconDeviceFloppy, IconPlus } from '@tabler/icons-react';
import S from './style.module.css';
import { useBrowserLibraryManager } from '../../../hooks/library-offline-manager.ts';
import { useEffect, useState } from 'react';
import type { INovel } from '../homepage/default/index.tsx';
import { useFetch } from '../../../hooks/useFetch.ts';
import { Loading } from '../../shared/loading/index.tsx';
import { getNovelWithChapters, type INovelFull } from '../../../api/get-novel-with-chapters.ts';
import { getNovel } from '../../../api/get-novel.ts';
import { LibraryList } from '../../organisms/library-list/index.tsx';
import type { IBookLibrary } from '../../molecules/library-book/index.tsx';


type StorageEstimate = {
  usagePercent: number;
  quotaSize: string;
}

export const LibraryDefaultTemplate = () => {

  const [books, setBooks] = useState<IBookLibrary[]>([])
  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate | null>({} as StorageEstimate);
  const { getStorageEstimate, findBooks } = useBrowserLibraryManager()

  const { isLoading, data } = useFetch({
    queryKey: ['get-open-book'],
    queryFn: getNovel
  })

  useEffect(() => {
    if (!isLoading && data && data?.novel) {
      const novel = data.novel
      if (!books.some(b => b.title === novel.title)) {
        setBooks(books => ([...books, { ...novel, isOfflineStored: false, isCurrentOpen: true }]))
      } else {
        const index = books.findIndex(b => b.title === novel.title)
        setBooks(books => {
          const book = books[index];
          books.splice(index, 1, { ...book, isCurrentOpen: true })
          return books;
        })
      }
    }
  }, [isLoading, data, books])

  const asyncRunning = async () => {
    const _storageEstimate = await getStorageEstimate()
    console.log(_storageEstimate)
    if (_storageEstimate.success) {
      setStorageEstimate(_storageEstimate.data)
    } else {
      setStorageEstimate(null)
    }

    const _books = await findBooks();

    if (_books.success) {
      setBooks(_books.data.map(b => ({ ...b, isOfflineStored: true, isCurrentOpen: b.title === data?.novel?.title })))
    }
  }

  useEffect(() => {
    if (!isLoading && data && data.novel) {
      asyncRunning().catch(console.error)
    }

    document.addEventListener('library-update', asyncRunning)

    return () => {
      document.removeEventListener('library-update', asyncRunning)
    }
  }, [isLoading, data])


  if (isLoading) return <Loading />

  return (
    <main className={S.main}>
      <header className={S.header}>
        <div className={S.group}>
          <button className={S.btn_back}><IconArrowBack /></button>
          <h1>Library</h1>
        </div>
        <div className={S.quota}>
          {storageEstimate === null && 'Storage Estimate unsupported'}
        </div>
      </header>
      <section className={S.section_browser_offline_books}>
        <h2>Browser Books</h2>
        <LibraryList books={books} />
      </section>
    </main>
  )
}