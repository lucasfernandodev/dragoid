import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { FC } from '../../../../../types/front-end/fc.ts';
import type { ReplacementList } from '../../../../../types/front-end/replacement-list.ts';
import S from './style.module.css';
import { useState } from 'react'; 
import { replacementListScheme } from '../../../../schema/replacement-list.ts';
import { useReplacementList } from '../../../../hooks/useReplacementList.tsx';
import { cn } from '../../../../utils/cn.ts';

interface ReplacementListEdit {
  list: ReplacementList;
  onAfterSave: (list: ReplacementList) => void;
  onCancel: () => void;
}

const mapToIndex = (list: ReplacementList['list']) => {
  const map = {} as Record<number, Record<string, string>>
  Object.entries(list).map((item, index) => {
    map[index] = {
      [item[0]]: item[1]
    }
  })
  return map;
}



export const ReplacementListEdit: FC<ReplacementListEdit> = ({
  list,
  onAfterSave,
  onCancel
}) => {

  const [itens, setItens] = useState<Record<number, Record<string, string>>>(mapToIndex(list.list))
  const [error, setError] = useState({ index: -1, message: '' })
  const { updateList } = useReplacementList();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = {} as ReplacementList['list'];

    Object.values(itens).map((item, index) => {
      const [key, value] = Object.entries(item)[0];
      const result = replacementListScheme.shape.list.safeParse({
        [key]: value
      })

      if (!result.success) {
        setError({ index: index, message: result.error.issues[0].message })
        return;
      }
      data[key] = value;
    })

    updateList(list.id, data)
    onAfterSave({ id: list.id, list: data })
  }

  const addItem = () => {
    let stateError = { index: -1, message: '' }
    Object.values(itens).map((item, index) => {
      const [key, value] = Object.entries(item)[0];
      const result = replacementListScheme.shape.list.safeParse({
        [key]: value
      })

      if (!result.success) {
        stateError = { index: index, message: result.error.issues[0].message }
      }
    })

    setError(stateError)

    if (stateError.index === -1) {
      setItens(old => ({ ...old, [Object.keys(old).length]: { '': '' } }))
    }
  }

  const removeItem = (index: number) => {
    setItens(old => {
      const { [index]: _, ...rest } = old;
      return rest;
    })
  }

  const updateValue = (index: number, value: string) => {
    setItens(old => {
      const [key] = Object.entries(old[index])[0];
      return {
        ...old,
        [index]: {
          [key]: value
        }
      }
    })
  }

  const updateKey = (index: number, key: string) => {
    setItens(old => {
      const [, value] = Object.entries(old[index])[0];
      return {
        ...old,
        [index]: {
          [key]: value
        }
      }
    })
  }


  return (
    <form onSubmit={onSubmit} className={S.form}>
      <div className={S.group}>
        <button className={cn(S.button, S.save)} type="button" onClick={addItem}>
          <IconPlus />
          <span>New replacement item</span>
        </button>
      </div>
      <div className={S.container_values}>
        {Object.keys(itens).map((key: string, index) => {
          const parsedKey = Number.parseInt(key)
          const [itemKey, itemValue] = Object.entries(itens[parsedKey])[0]

          return (
            <div  className={S.group} key={index} data-invalid={error.index === parsedKey}>
              <div>
                <input
                  onChange={e => updateKey(parsedKey, e.currentTarget.value)}
                  type="text"
                  className={S.from}
                  value={itemKey}
                  placeholder='original'
                />
                <span className={S.divider}>/</span>
                <input
                  onChange={e => updateValue(parsedKey, e.currentTarget.value)}
                  type="text"
                  className={S.to}
                  value={itemValue}
                  placeholder='replacement'
                />
                <button onClick={() => removeItem(parsedKey)} type="button" className={S.button}><IconTrash /></button>
              </div>
              {error.index === parsedKey && <p className={S.error}>{error.message}</p>}
            </div>
          )
        })}
      </div>
      <div className={S.form_actions}>
        <button className={S.button} type='button' onClick={onCancel}>Cancel</button>
        <button className={S.button} type="submit">Save</button>
      </div>
    </form>
  )
}