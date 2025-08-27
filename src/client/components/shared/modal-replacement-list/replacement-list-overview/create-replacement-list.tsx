import { useState, type FC, type FormEvent } from 'react';
import S from './style.module.css';  
import { replacementListIdSchema } from '../../../../schema/replacement-list-id.ts';

interface CreateReplacementListProps {
  onCancel: () => void;
  onSave: (id: string) => void;
  currentIds: string[]
}

export const CreateReplacementList: FC<CreateReplacementListProps> = ({
  onCancel, onSave, currentIds
}) => {
  const [id, setId] = useState<null | string>(null);
  const [isError, setIsError] = useState<null | string>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (id === null) {
      setIsError('Id empty')
      return;
    }

    const safe = replacementListIdSchema.safeParse({ id });
    if (safe.success) {
      if (!currentIds.find(currentId => id === currentId)) {
        onSave(safe.data.id)
        return
      }
      
      setIsError('Duplicated id')
      return;
    }

    setIsError(safe.error.issues[0].message)
  }

  const _onCancel = () => {
    setId(null)
    onCancel()
  }

  return (
    <form className={S.form} onSubmit={onSubmit}>
      <label htmlFor="list-id">
        Choose a label for this list:
      </label>
      <input
        onChange={e => setId(e.currentTarget.value)}
        id="list-id"
        name="list-id"
        type="text"
        placeholder='Id...'
        data-error={!!isError}
      />
      {isError && <p className={S.error}>{isError}</p>}
      <div className={S.form_actions}>
        <button className={S.button} type='submit'>
          Save
        </button>
        <button className={S.button} onClick={_onCancel} type='button'>
          Cancel
        </button>
      </div>
    </form>
  )
}