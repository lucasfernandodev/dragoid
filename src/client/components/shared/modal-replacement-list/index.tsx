import S from './style.module.css';
import { IconX } from '@tabler/icons-react';
import { Modal } from '../modal/index.tsx';
import { ReplacementListOverview } from './replacement-list-overview/index.tsx';
import { ReplacementListEdit } from './replacement-list-edit/index.tsx';
import { useState } from 'react';
import type { ReplacementList } from '../../../types/replacement-list.ts';
import { useReplacementList } from '../../../hooks/useReplacementList.tsx';

interface ModalReplacementListProps {
  isOpen: boolean;
  closeModal: () => void
}

export const ModalReplacementList = ({
  isOpen,
  closeModal
}: ModalReplacementListProps) => {

  const { getActiveList } = useReplacementList()
  const [editList, setEditList] = useState<null | ReplacementList>(null)

  const saveList = (list: ReplacementList) => {
    setEditList(null)
    const activeList = getActiveList();
    if (activeList?.id === list.id) {
      window.location.reload();
    }
  }

  return (
    <Modal.Root isOpen={isOpen}>
      <Modal.Wrapper className={S.modal_wrapper}>
        <Modal.Header>
          <Modal.Title>
            Replacement Chapter Content
          </Modal.Title>
          <Modal.CloseButton onClick={closeModal}>
            <IconX />
          </Modal.CloseButton>
        </Modal.Header>
        <Modal.Content>
          <div className={S.container}>
            {!editList && <ReplacementListOverview onEditList={list => setEditList(list)} />}
            {editList && <ReplacementListEdit
              list={editList}
              onCancel={() => setEditList(null)}
              onAfterSave={saveList}
            />}
          </div>
        </Modal.Content>
      </Modal.Wrapper>
    </Modal.Root>
  )
}