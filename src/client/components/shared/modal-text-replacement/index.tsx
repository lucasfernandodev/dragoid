import S from './style.module.css';
import { IconTextWrap, IconX } from '@tabler/icons-react';
import { Modal } from '../modal/index.tsx';
import { useState } from 'react';
import { TextReplacementOverview } from './overview/index.tsx';
import { TextReplacementEditor } from './editor/index.tsx';

interface ModalTextReplacementProps {
  isOpen: boolean;
  closeModal: () => void
}

export const ModalTextReplacement = ({
  isOpen,
  closeModal
}: ModalTextReplacementProps) => {

  const [editorListId, setEditorListId] = useState<string | null>(null)

  const swapToListEditor = (id: string) => {
    setEditorListId(id)
  }

  return (
    <Modal.Root isOpen={isOpen}>
      <Modal.Wrapper className={S.modal_wrapper}>
        <Modal.Header>
          <Modal.HeaderGroup>
            <IconTextWrap />
            <Modal.Title>
              Text replacement manager
            </Modal.Title>
          </Modal.HeaderGroup>
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