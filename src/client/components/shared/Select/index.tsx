import { useEffect, useRef, useState } from 'react'
import S from './style.module.css'
import { cn } from '../../../utils/cn.ts'

interface SelectItem<T> {
  label: T
  value: T
}

interface SelectProps<T> {
  values: SelectItem<T>[]
  defaultValue?: SelectItem<T>
  onChange?: (value: SelectItem<T>) => void
  placeholder: string
  className?: {
    select?: string
    options?: string
    option?: string
  }
}

// Reference
// https://medium.com/lego-engineering/building-accessible-select-component-in-react-b61dbdf5122f
export function Select<T extends string | number>({
  values,
  placeholder,
  defaultValue,
  onChange,
  className,
}: SelectProps<T>) {
  const [showDropdown, setshowDropdown] = useState(false)
  const [selectedValue, setSelectedValue] = useState<null | SelectItem<T>>(null)
  const [isFocus, setIsFocus] = useState(false)
  const [itemFocused, setItemFocused] = useState<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const triggerRef = useRef<HTMLInputElement>(null)

  const onSelectValue = (value: SelectItem<T>) => {
    setSelectedValue(value)
    setshowDropdown(false)
    setItemFocused(null)

    if (onChange && value !== selectedValue) {
      onChange(value)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    const list = listRef.current
    const vh = window.innerHeight

    if (!container || !list || !showDropdown) return

    const { top, left, width, height } = container.getBoundingClientRect()
    const { height: listHeight } = list.getBoundingClientRect()

    const isOverflowTop = top - listHeight < 0

    const isOverflowBottom = top + height + listHeight > vh

    // Resizing
    if (isOverflowBottom && isOverflowTop) {
      list.style.top = `${top - listHeight}px`
      list.style.height = `${listHeight - (top - listHeight - 8) * -1}px`
    }
    // Overflow not detect
    if (!isOverflowBottom && !isOverflowTop) {
      list.style.top = `${top + height}px`
    }
    // overflow bottom
    if (isOverflowBottom && !isOverflowTop) {
      list.style.top = `${top - listHeight}px`
    }
    // overflow top
    if (!isOverflowBottom && isOverflowTop) {
      list.style.top = `${top + height}px`
    }

    list.style.left = `${left}px`

    list.style.width = `${width}px`
    list.focus()
  }, [containerRef, listRef, showDropdown])

  const onBlur = (e: React.FocusEvent<HTMLUListElement, Element>) => {
    const nextFocus = e.relatedTarget as Node | null

    if (containerRef.current && !containerRef.current.contains(nextFocus)) {
      setshowDropdown(false)
      setItemFocused(null)
      return
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFocus && !showDropdown) {
      switch (e.key) {
        case 'Up':
        case 'ArrowUp':
        case 'Down':
        case 'ArrowDown':
        case ' ': // Space
        case 'Enter':
          e.preventDefault()
          setshowDropdown(true)
      }
    }
  }

  useEffect(() => {
    function openListHandle(e: KeyboardEvent) {
      if (isFocus && showDropdown) {
        if (!listRef.current || !triggerRef.current) return
        const firstChild = listRef.current.firstElementChild as HTMLElement
        switch (e.key) {
          case 'Esc':
          case 'Escape':
            e.preventDefault()
            setshowDropdown(false)
            return
          case 'ArrowUp':
            e.preventDefault()
            if (!itemFocused) {
              firstChild.focus()
              setItemFocused(firstChild)
              return
            }
            const prevElement =
              itemFocused.previousElementSibling as HTMLElement | null
            if (prevElement) {
              prevElement.focus()
              setItemFocused(prevElement)
            }
            return
          case 'ArrowDown':
            e.preventDefault()
            if (!itemFocused) {
              firstChild.focus()
              setItemFocused(firstChild)
              return
            }
            const nextElement =
              itemFocused.nextElementSibling as HTMLElement | null
            if (nextElement) {
              nextElement.focus()
              setItemFocused(nextElement)
            }
            return
          case 'Enter':
          case ' ': // Space
            e.preventDefault()

            if (itemFocused) {
              let value: string | number | undefined = undefined
              const valueType = itemFocused.dataset.type
              const rawValue = itemFocused.dataset.value
              if (valueType === 'string' && rawValue) {
                value = String(rawValue)
              }

              if (valueType === 'number' && rawValue) {
                value = Number.parseInt(rawValue as string)
              }

              if (!value) return
              const isOptions = values.filter(
                (option) => option.value === value
              )
              if (isOptions.length === 0) return
              setSelectedValue(isOptions[0])
              setshowDropdown(false)
              setItemFocused(null)
              triggerRef.current.focus()
              setIsFocus(true)
            }
            return
        }
      }
    }

    window.addEventListener('keydown', openListHandle)

    return () => {
      window.removeEventListener('keydown', openListHandle)
    }
  }, [isFocus, itemFocused, showDropdown])

  useEffect(() => {
    const isDefault = values.find(
      (option) =>
        option.label === defaultValue?.label &&
        option.value === defaultValue?.value
    )

    // Só atualiza se o valor atual for diferente
    if (isDefault && selectedValue?.value !== isDefault.value) {
      setSelectedValue(isDefault)
    }
  }, [defaultValue, values])

  return (
    <div
      className={S.container_select}
      ref={containerRef}
      data-expanded={showDropdown}
    >
      <input
        type="text"
        className={cn(S.select_input, className?.select)}
        placeholder={placeholder}
        value={selectedValue ? selectedValue.value : ''}
        readOnly={true}
        onClick={() => setshowDropdown((old) => !old)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={showDropdown}
        onFocus={() => setIsFocus(true)}
        onKeyDown={onKeyDown}
        ref={triggerRef}
      />
      <ul
        aria-multiselectable={false}
        role="listbox"
        className={cn(S.dropdown, className?.options)}
        onBlur={onBlur}
        data-hidden={!showDropdown}
        ref={listRef}
        tabIndex={-1}
        onFocus={() => setIsFocus(true)}
      >
        {values.map((option) => {
          const { label, value } = option

          return (
            <li
              key={`${label}:${value}`}
              onClick={() => onSelectValue(option)}
              data-value={value}
              data-type={typeof value}
              data-active={
                defaultValue?.value === value || selectedValue?.value === value
              }
              aria-selected={
                defaultValue?.value === value || selectedValue?.value === value
              }
              role="option"
              onFocus={() => setIsFocus(true)}
              tabIndex={-1}
              className={cn(S.option, className?.option)}
            >
              {label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
