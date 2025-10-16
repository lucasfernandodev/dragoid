import S from './style.module.css';
import { IconX } from '@tabler/icons-react';
import { Modal } from '../modal/index.tsx';
import { useState } from 'react';
import { TextReplacementOverview } from './overview/index.tsx';
import { TextReplacementEditor } from './editor/index.tsx';

interface ModalReplacementListProps {
  isOpen: boolean;
  closeModal: () => void
}

export const ModalReplacementList = ({
  isOpen,
  closeModal
}: ModalReplacementListProps) => {

  const [editorListId, setEditorListId] = useState<string | null>(null)

  const swapToListEditor = (id: string) => {
    setEditorListId(id)
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
          {!editorListId ? (
            <TextReplacementOverview
              onEditListActive={swapToListEditor}
            />
          ) : (
            <TextReplacementEditor
              listId={editorListId}
              onCancel={() => setEditorListId(null)}
            />
          )}
        </Modal.Content>
      </Modal.Wrapper>
    </Modal.Root>
  )
}