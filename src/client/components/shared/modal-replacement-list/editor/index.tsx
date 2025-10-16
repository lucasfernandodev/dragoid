import { IconDeviceFloppy, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button } from '../../../atoms/button/index.tsx';
import S from './style.module.css';
import type { FC } from '../../../../types/fc.ts';
import { useReplacementList } from '../../../../hooks/useReplacementList.tsx';
import { useRef, useState, type ComponentProps, forwardRef, useEffect } from 'react';
import { replacementListScheme } from '../../../../schema/replacement-list.ts';
import type { ReplacementList } from '../../../../types/replacement-list.ts';
import { TextReplacementRulesListSubmit, type TextReplacementRulesList } from './submit.ts';
import { TextReplacementMapper } from './mappter.ts';

interface IListItemProps extends ComponentProps<'li'> {
  position: number;
  onDeleteRule: () => void;
  target?: string;
  source?: string;
  errors: {
    target?: string;
    source?: string;
    listItem?: string
  }
  onSourceChange: (value: string) => void;
  onTargetChange: (value: string) => void
}

const ListItem = forwardRef<HTMLLIElement, IListItemProps>(({
  position,
  onDeleteRule,
  target,
  source,
  errors = {},
  onSourceChange,
  onTargetChange,
  ...props
}, ref) => {
  return (
    <li {...props} ref={ref} className={S.list_item} data-invalid={!!errors.listItem} >
      <div className={S.row}>
        <h3 className={S.title}>
          {position}. Replace Rule
        </h3>
        <div className={S.actions}>
          <Button variant='secondary' onClick={onDeleteRule}>
            <IconTrash />
            <span>Delete</span>
          </Button>
        </div>
      </div>
      <div className={S.row}>
        <div className={S.group}>
          <input
            data-invalid={!!errors.source}
            defaultValue={source || ''}
            name='source[]'
            type="text"
            className={S.source}
            placeholder='Source'
            onChange={ev => onSourceChange(ev.currentTarget.value)}
          />
          <p className={S.source_error}>{errors.source}</p>
        </div>
        <div className={S.group}>
          <input
            data-invalid={!!errors.target}
            defaultValue={target || ''}
            name={`target[]`}
            type="text"
            className={S.target}
            placeholder="Target"
            onChange={ev => onTargetChange(ev.currentTarget.value)}
          />
          <p className={S.target_error}>{errors.target}</p>
        </div>
      </div>
      <div className={S.row}>
        <p className={S.list_item_error}>{errors.listItem}</p>
      </div>
    </li>
  )
})

ListItem.displayName = 'ListItem'


const EmptyRule = () => {
  return (
    <div className={S.empty_rule}>
      <p>Your replacement rules are empty</p>
    </div>
  )
}




interface IRenderRuleListProps {
  list: {
    source: {
      value?: string;
      error?: string;
    },
    target: {
      value?: string,
      error?: string
    },
    error?: string
  }[],
  onSourceChange: (position: number, value: string) => void;
  onTargetChange: (position: number, value: string) => void;
  onDeleteRule: (position: number) => void;
}

const RenderRuleList: FC<IRenderRuleListProps> = ({ list, onSourceChange, onTargetChange, onDeleteRule }) => {
  const listSize = list.length - 1;
  const listItemRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (listItemRef.current) {
      const input = listItemRef.current.querySelector('input');
      if (input) {
        input.focus()
      }
    }
  }, [listSize])

  return (
    <ul className={S.list}>
      {list.map((item, index) => {

        return <ListItem
          ref={index === listSize ? listItemRef : null}
          onDeleteRule={() => onDeleteRule(index)}
          errors={{
            listItem: item.error,
            source: item.source.error,
            target: item.target.error
          }}
          position={index + 1}
          key={`${list[0]}-${list[1]}-${index}`}
          target={item.target.value}
          source={item.source.value}
          onSourceChange={value => onSourceChange(index, value)}
          onTargetChange={value => onTargetChange(index, value)}
        />
      })}
    </ul>
  )
}



const useEditor = (replacementList?: ReplacementList['list']) => {

  const [list, setList] = useState(
    () => TextReplacementMapper.toList(replacementList)
  )

  const addListRule = () => {
    const newRule = TextReplacementMapper.toList({ '': '' })
    setList(current => ([...current, ...newRule]))
  }

  const deleteListRule = (position: number) => {
    // Verificar se o item removido está em uma lista ativa,se estiver deve ser feito o reload da page;
    setList(list => list.filter((_, i) => i !== position))
  }

  const updateError = (type: 'source' | 'target' | 'item', position: number, message: string) => {
    setList(list => {
      return list.map((item, index) => {
        if (index !== position) return item;
        const _item = item;
        if (type === 'source') {
          _item.source.error = message;
        }
        if (type === 'target') {
          _item.target.error = message;
        }
        if (type === 'item') {
          _item.error = message;
        }
        return _item
      })
    })
  }

  const clearAllErrors = () => {
    setList(list => {
      return list.map((item, index) => {
        const _item = item;
        _item.source.error = undefined;
        _item.target.error = undefined;
        _item.error = undefined;
        return _item
      })
    })
  }

  const updateSource = (pos: number, value: string) => {
    setList(list => {
      return list.map((item, index) => {
        if (index !== pos) return item;
        return {
          ...item,
          source: {
            value: value
          }
        }
      })
    })
  }

  const updateTarget = (pos: number, value: string) => {
    setList(list => {
      return list.map((item, index) => {
        if (index !== pos) return item;
        return {
          ...item,
          target: {
            value: value
          }
        }
      })
    })
  }

  return {
    rules: list,
    addRule: addListRule,
    deleteRule: deleteListRule,
    updateRuleSource: updateSource,
    updateRuleTarget: updateTarget,
    setRuleError: updateError,
    clearAllErrors
  }
}




interface ITextReplacementEditorProps {
  listId: string;
  onCancel: () => void
}

export const TextReplacementEditor: FC<ITextReplacementEditorProps> = ({
  onCancel,
  listId
}) => {

  const { getList, updateList, getActiveList } = useReplacementList()
  const {
    rules,
    addRule,
    updateRuleSource,
    updateRuleTarget,
    deleteRule,
    clearAllErrors,
    setRuleError
  } = useEditor(getList(listId)?.list)

  if (!rules) {
    return (
      <div className={S.listNotFound}>
        <p>Error: List not found</p>
        <Button onClick={onCancel}>Back </Button>
      </div>
    )
  }


  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const storageRulesOnDB = (rules: Record<string, string>) => {
      const activeList = getActiveList();
      updateList(listId, rules)
      if (activeList?.id === listId) window.location.reload()
      onCancel()
    }

    TextReplacementRulesListSubmit({
      rules,
      updateError: setRuleError,
      clearErrors: clearAllErrors,
      onSaveRulesList: storageRulesOnDB
    })
  }





  return (
    <form className={S.editor} onSubmit={onSubmit}>
      <Button type='button' onClick={addRule}>
        <IconPlus />
        <span>Add replacement item</span>
      </Button>
      <div className={S.rules}>
        {rules.length === 0 ? <EmptyRule /> : <RenderRuleList
          onDeleteRule={deleteRule}
          onSourceChange={updateRuleSource}
          onTargetChange={updateRuleTarget}
          list={rules}
        />}
      </div>
      <div className={S.actions}>
        <Button onClick={onCancel} type='button' variant='secondary'>
          Cancel
        </Button>
        <Button type='submit'>
          <IconDeviceFloppy />
          <span>Save</span>
        </Button>
      </div>
    </form>
  )
}