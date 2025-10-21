import S from './style.module.css'
import { memo, useEffect, useRef, useState } from 'react'
import { useFetch } from '../../../hooks/useFetch.ts'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { SkeletonChapterListItens } from '../skeleton/index.tsx'
import { Modal } from '../modal/index.tsx'
import { IconCheck, IconList, IconX } from '@tabler/icons-react'
import { useReadProgress } from '../../../hooks/useReadProgress.tsx'
import { _fetch } from '../../../utils/fetch.ts'

interface IChapterList {
  id: number
  title: string
}

interface ModalChapterListProps {
  id: number
  isOpen: boolean
  closeModal: () => void
}

interface IResult {
  success: boolean
  title: string
  chapterList: IChapterList[]
}

interface ChapterListItemProps {
  ch: IChapterList
  isRead: boolean
  isActive: boolean
  ref: React.RefObject<HTMLLIElement | null> | null
  onChapterSelect: () => void
}

interface ChapterListProps {
  currentId: number
  novelTitle: string
  list: IResult['chapterList']
  onChapterSelect: () => void
}

const ChapterListItem = ({
  ch,
  isActive,
  isRead = false,
  ref,
  onChapterSelect,
}: ChapterListItemProps) => {
  const onSelected = () => {
    setTimeout(onChapterSelect, 300)
  }
  return (
    <li className={S.item} ref={ref} tabIndex={-1}>
      <Link
        onClick={onSelected}
        data-active={isActive}
        title={ch.title}
        to={`/chapter/?id=${ch.id}`}
      >
        <span title={ch.title}>{ch.title}</span>
        {isRead && (
          <span title="Chapter read" className={S.chapter_read_checked}>
            <IconCheck />
          </span>
        )}
      </Link>
    </li>
  )
}

const ChapterList = memo(
  ({ currentId, onChapterSelect, novelTitle, list }: ChapterListProps) => {
    const { isRead: checkIsRead } = useReadProgress()
    const itemActiveFocusRef = useRef<HTMLLIElement>(null)

    useEffect(() => {
      if (itemActiveFocusRef.current) {
        itemActiveFocusRef.current.focus()
      }
    }, [])

    return (
      <ul className={S.chapterList}>
        {' '}
        {list.map((ch) => {
          const isRead = checkIsRead({
            novelTitle: novelTitle,
            chapterId: ch.id,
            chapterTitle: ch.title,
          })
          return (
            <ChapterListItem
              key={ch.id}
              ch={ch}
              isActive={ch.id === currentId}
              isRead={isRead}
              ref={ch.id === currentId ? itemActiveFocusRef : null}
              onChapterSelect={onChapterSelect}
            />
          )
        })}
      </ul>
    )
  }
)

export const ModalChapterList = ({
  closeModal,
  isOpen,
  id,
}: ModalChapterListProps) => {
  const { isLoading, data: result } = useFetch({
    queryKey: ['getChapterList'],
    queryFn: async () => {
      const response = await fetch('/api/chapter')
      const data = await response.json()
      return data as IResult
    },
    isEnabled: isOpen && typeof id === 'number',
  })

  return (
    <Modal.Root isOpen={isOpen}>
      <Modal.Wrapper className={S.wrapper}>
        <Modal.Header>
          <Modal.HeaderGroup>
            <IconList />
            <Modal.Title>Chapter List</Modal.Title>
          </Modal.HeaderGroup>
          <Modal.CloseButton onClick={closeModal}>
            <IconX />
          </Modal.CloseButton>
        </Modal.Header>
        <Modal.Content className={S.content}>
          {isLoading && !result && <SkeletonChapterListItens />}
          {result && (
            <ChapterList
              onChapterSelect={closeModal}
              list={result?.chapterList}
              novelTitle={result?.title}
              currentId={id}
            />
          )}
        </Modal.Content>
      </Modal.Wrapper>
    </Modal.Root>
  )
}
