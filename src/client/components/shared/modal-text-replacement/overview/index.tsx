import { useState, type ComponentProps, useEffect } from 'react'
import S from './style.module.css'
import type { FC } from '../../../../types/fc.ts'
import {
  IconDeviceFloppy,
  IconDownload,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react'
import { Button } from '../../../atoms/button/index.tsx'
import { replacementListIdSchema } from '../../../../schema/replacement-list-id.ts'
import { useReplacementList } from '../../../../hooks/useReplacementList.tsx'
import { exportReplacementList } from '../../../../utils/export-replacement-list.ts'
import {
  parseFileToJson,
  type ParseFileJsonError,
} from '../../../../utils/parse-file-to-json.ts'
import type { ReplacementList } from '../../../../types/replacement-list.ts'
import { replacementListScheme } from '../../../../schema/replacement-list.ts'

interface IListAdderProps {
  onOpenCreateList: () => void
  onUploadList: (file: File) => void
}

export const ListAdder: FC<IListAdderProps> = ({
  onOpenCreateList,
  onUploadList,
}) => {
  const parseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.currentTarget
    if (!currentInput || !currentInput.files) {
      return
    }

    const file = currentInput.files[0]
    onUploadList(file)
  }

  return (
    <div className={S.listAdder}>
      <Button className={S.btn} onClick={onOpenCreateList}>
        <IconPlus />
        <span>Create replacement list</span>
      </Button>
      <Button variant="secondary" className={S.btn} asChild>
        <label htmlFor="upload-list" className={S.button}>
          <IconUpload />
          <span>Upload</span>
          <input
            accept=".json"
            onChange={parseUpload}
            id="upload-list"
            type="file"
            hidden
          />
        </label>
      </Button>
    </div>
  )
}

interface IListCreatorProps {
  onCreatingSuccess: (id: string) => void
  onCancel: () => void
}

export const ListCreator: FC<IListCreatorProps> = ({
  onCancel,
  onCreatingSuccess,
}) => {
  const [error, setError] = useState<string | null>(null)
  const { getList, addList } = useReplacementList()

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()

    const data = Object.fromEntries(new FormData(ev.currentTarget)) as {
      id: unknown
    }

    const isIdValid = replacementListIdSchema.safeParse(data)

    if (!isIdValid.success) {
      const issues = isIdValid.error.issues || []
      setError(issues.map((issue) => issue.message)[0])
      return
    }

    if (getList(isIdValid.data?.id)) {
      setError('An id with this id already exists')
      return
    }

    addList(isIdValid.data?.id)
    onCreatingSuccess(isIdValid.data?.id)
  }

  return (
    <form className={S.listCreator} onSubmit={onSubmit}>
      <div className={S.form_group}>
        <label htmlFor="list-id">Choose a label for list:</label>
        <input
          data-invalid={!!error}
          name="id"
          id="list-id"
          type="text"
          className={S.form_input}
          placeholder="List identify..."
        />
        {error && error.length > 0 ? (
          <p className={S.form_error}>{error}</p>
        ) : null}
      </div>
      <div className={S.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <IconDeviceFloppy />
          <span>Save</span>
        </Button>
      </div>
    </form>
  )
}

export const ListEmpty = () => {
  return (
    <div className={S.list_empty}>
      <p>No text replacement list available</p>
    </div>
  )
}

interface IListItemProps extends ComponentProps<'li'> {
  id: string
  activeListId?: string
  actions: {
    editList: (id: string) => void
    deleteList: (id: string) => void
    exportList: (id: string) => void
    toggleListActive: (id: string) => void
  }
}

export const ListItem: FC<IListItemProps> = ({
  id,
  activeListId,
  actions,
  ...props
}) => {
  const { deleteList, editList, exportList, toggleListActive } = actions
  return (
    <li {...props} className={S.list_item}>
      <h3>{id}</h3>
      <div className={S.item_actions}>
        <Button variant="secondary" onClick={() => editList(id)}>
          <IconEdit />
          <span>Edit</span>
        </Button>
        <Button variant="secondary" onClick={() => deleteList(id)}>
          <IconTrash />
          <span>Delete</span>
        </Button>
        <Button variant="secondary" onClick={() => exportList(id)}>
          <IconDownload />
          <span>Export</span>
        </Button>
        <Button variant="secondary" asChild>
          <label className={S.select} htmlFor={`list-select:${id}`}>
            <input
              value={id}
              type="radio"
              name="list-select"
              id={`list-select:${id}`}
              checked={activeListId === id}
              onClick={() => toggleListActive(id)}
              onChange={() => {}}
            />
          </label>
        </Button>
      </div>
    </li>
  )
}

interface IRenderListProps {
  lastCreateId: string | null
  onEditListActive: (listId: string) => void
}

export const RenderList: FC<IRenderListProps> = ({
  lastCreateId,
  onEditListActive,
}) => {
  const {
    getCollection,
    getList,
    getActiveList,
    deleteList,
    toggleListActive,
  } = useReplacementList()
  const [activeList] = useState(() => getActiveList())

  const [listIds, setListIds] = useState(() => getCollection())

  useEffect(() => {
    const updated = getCollection()
    setListIds((_) => [...updated])
  }, [lastCreateId])

  if (listIds.length === 0) {
    return <ListEmpty />
  }

  const actions = ({ id, list }: ReplacementList) => ({
    deleteList: () => {
      setListIds((oldLists) =>
        [...oldLists].filter((oldList) => id !== oldList.id)
      )
      deleteList(id)
      if (id === activeList?.id) {
        toggleListActive()
        window.location.reload()
      }
    },
    editList: () => {
      if (getList(id)) {
        onEditListActive(id)
      }
    },
    toggleListActive: () => {
      toggleListActive(id)
      window.location.reload()
    },
    exportList: () => {
      exportReplacementList(id, list)
    },
  })

  return (
    <ul className={S.list}>
      {listIds.map((list) => (
        <ListItem
          key={list.id}
          id={list.id}
          activeListId={getActiveList()?.id}
          actions={actions(list)}
        />
      ))}
    </ul>
  )
}

interface IGlobalErrorProps {
  error?: string | null
  onCleanError: () => void
}

export const GlobalError: FC<IGlobalErrorProps> = ({ error, onCleanError }) => {
  if (typeof error !== 'string' || error?.length <= 0) {
    return null
  }

  return (
    <div className={S.global_error}>
      <p className={S.message}>{error}</p>
      <Button className={S.btn} onClick={onCleanError} variant="secondary">
        <IconX />
      </Button>
    </div>
  )
}

interface ITextReplacementOverviewProps {
  onEditListActive: (listId: string) => void
}

export const TextReplacementOverview: FC<ITextReplacementOverviewProps> = ({
  onEditListActive,
}) => {
  const { getList, addList } = useReplacementList()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [updatedLastId, setUpdatedLastId] = useState<null | string>(null)
  const [isCreatingMode, setIsCreatingMode] = useState(false)

  const openCreateList = () => {
    setGlobalError(null)
    setIsCreatingMode(true)
  }

  const hiddenCreateList = () => setIsCreatingMode(false)

  const onCreateListSuccess = (id: string) => {
    setUpdatedLastId(id)
    hiddenCreateList()
  }

  const onUploadHandle = async (file: File) => {
    try {
      const result = await parseFileToJson<ReplacementList>(file)
      if (!result.success) {
        setGlobalError(result?.message || null)
        return
      }

      const parseFileSchema = replacementListScheme.safeParse(result.data)
      if (!parseFileSchema.success) {
        setGlobalError(parseFileSchema?.error.issues[0].message || null)
        return
      }

      const { id, list } = parseFileSchema.data
      if (getList(id)) {
        setGlobalError('Error: A list with this id already exists')
        return
      }

      addList(id, list)
      setUpdatedLastId(id)
    } catch (error: unknown) {
      const { message } = error as ParseFileJsonError
      setGlobalError(message)
      return
    }
  }

  if (isCreatingMode) {
    return (
      <div className={S.overview}>
        <ListCreator
          onCancel={hiddenCreateList}
          onCreatingSuccess={onCreateListSuccess}
        />
      </div>
    )
  }

  return (
    <div className={S.overview}>
      <ListAdder
        onOpenCreateList={openCreateList}
        onUploadList={onUploadHandle}
      />
      <GlobalError
        onCleanError={() => setGlobalError(null)}
        error={globalError}
      />
      <RenderList
        onEditListActive={onEditListActive}
        lastCreateId={updatedLastId}
      />
    </div>
  )
}
