import S from './style.module.css';
import { useEffect, useState } from "react";
import { CreateReplacementList } from "./create-replacement-list.tsx"
import type { FC } from "../../../../types/fc.ts";
import type { ReplacementList } from '../../../../types/replacement-list.ts';
import { IconDownload, IconEdit, IconPlus, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { replacementListScheme } from '../../../../schema/replacement-list.ts';
import { parseFileToJson } from '../../../../../utils/parse-file-to-json.ts';
import { useReplacementList } from '../../../../hooks/useReplacementList.tsx';
import { cn } from '../../../../utils/cn.ts';

interface AddListFormProps {
  allListIds: string[];
  onListCreate: (id: string) => void;
  onUpload: (list: ReplacementList) => void
}

export const AddListForm: FC<AddListFormProps> = ({
  onListCreate,
  allListIds,
  onUpload
}) => {
  const [isListCreating, setIsListCreating] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null)

  const addNewReplacementList = (id: string) => {
    setIsListCreating(false)
    onListCreate(id)
  }

  const onUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.currentTarget;
    if (!currentInput || !currentInput.files) {
      return;
    }

    const file = currentInput.files[0];

    if (!file) {
      setUploadError('Upload error! File not found')
      return;
    }

    try {
      const result = await parseFileToJson<ReplacementList>(file);

      if (!result.success) {
        result?.message && setUploadError(result.message)
        return;
      }

      const parseData = replacementListScheme.safeParse(result.data);

      if (!parseData.success) {
        setUploadError(`Invalid scheme! ${parseData.error.issues[0].message}`)
        return;
      }

      if (allListIds.find(id => parseData.data.id === id)) {
        setUploadError('Upload Error: Duplicated Id')
        return;
      }

      onUpload(parseData.data)
    } catch (error) {
      setUploadError((error as { message: string }).message)
    }
  }

  const resetUpload = () => {
    setUploadError(null)
  }

  return (
    <div className={S.creating_list}>
      {isListCreating && <CreateReplacementList
        onCancel={() => setIsListCreating(false)}
        onSave={addNewReplacementList}
        currentIds={allListIds}
      />}
      {!isListCreating && <div className={S.actions}>
        <button className={S.button} onClick={() => setIsListCreating(true)}>
          <IconPlus />
          <span>Create new list</span>
        </button>
        <label className={S.button}>
          <IconUpload />
          <span>Upload</span>
          <input onChange={onUploadFile} type="file" hidden />
        </label>
      </div>}
      {uploadError && <p className={S.upload_error}>
        <span>{uploadError}</span>
        <button className={S.button} onClick={resetUpload}>
          <IconX />
        </button>
      </p>}
    </div>
  )
}

interface OverviewProps {
  replacementLists: ReplacementList[],
  activeListId: string | null
  actions: {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onExport: (id: string) => void;
    onActive: (id: string) => void
  }
}

export const Overview: FC<OverviewProps> = ({
  replacementLists,
  activeListId,
  actions
}) => {

  return (
    <ul className={S.replacement_overview}>
      {replacementLists.length === 0 && <p>No replacement lists available</p>}
      {replacementLists.length > 0 && replacementLists.map(
        list => (
          <li key={list.id}>
            <h3 className={S.id}>{list.id}</h3>
            <div className={S.actions}>
              <button className={S.button} onClick={() => actions.onEdit(list.id)}>
                <IconEdit />
                <span>Edit</span>
              </button>
              <button className={S.button} onClick={() => actions.onDelete(list.id)}>
                <IconTrash />
                <span>Delete</span>
              </button>
              <button className={S.button} onClick={() => actions.onExport(list.id)}>
                <IconDownload />
                <span>Export</span>
              </button>
              <label className={cn(S.button, S.select)} htmlFor={`list-select:${list.id}`}>
                <input
                  value={list.id}
                  type="radio"
                  name="list-select"
                  id={`list-select:${list.id}`}
                  checked={activeListId === list.id}
                  onClick={() => actions.onActive(list.id)}
                  onChange={() => { }}
                />
              </label>
            </div>
          </li>
        )
      )}
    </ul>
  )
}

interface ReplacementListOverviewProps {
  onEditList: (list: ReplacementList) => void;
}

export const ReplacementListOverview: FC<ReplacementListOverviewProps> = ({
  onEditList
}) => {
  const { getCollection, deleteList, addList, getList, toggleListActive, getActiveList } = useReplacementList()
  const collection = getCollection()
  const activeListId = getActiveList()


  const exportList = (id: string) => {
    const list = getList(id);
    if (!list) return;
    const jsonString = JSON.stringify(list, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}.json`;
    document.body.appendChild(a); // Append to body to make it clickable in some browsers
    a.click();
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url);
  }

  const editList = (id: string) => {
    const list = getList(id);
    if (!list) return;
    onEditList(list)
  }

  const _toggleListActive = (id: string) => {
    toggleListActive(id)
    window.location.reload();
  }

  return (
    <>
      <AddListForm
        allListIds={collection.map(l => l.id)}
        onListCreate={addList}
        onUpload={(list) => addList(list.id, list.list)}
      />
      <Overview
        replacementLists={collection}
        activeListId={activeListId?.id || null}
        actions={{
          onActive: _toggleListActive,
          onDelete: deleteList,
          onExport: exportList,
          onEdit: editList
        }}
      />
    </>
  )
}