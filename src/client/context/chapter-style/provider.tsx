import { useState, type ReactNode, useEffect } from 'react'
import { ChapterStyleContext } from './context.ts'
import { ModalChapterStyle } from '../../components/shared/modal-chapter-style/index.tsx'

export interface ChapterStyleProperties {
  fontSize: number
  fontFamily: string
  lineHeight: number
  paragraphGap: number
}

const fontSizeOptions = [12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 34, 36]
const fontFamilyOptions = ['merriweather sans', 'nunito sans']
const lineHeightOptions = fontSizeOptions.map((option) => option * 2)
const paragraphGapOptions = [
  24,
  32,
  42,
  ...lineHeightOptions.map((option) => option * 2),
]

export const ChapterStyleSelectOptions = {
  fontSize: fontSizeOptions.map((option) => ({ label: option, value: option })),
  fontFamily: fontFamilyOptions.map((option) => ({
    label: option,
    value: option,
  })),
  lineHeight: lineHeightOptions.map((option) => ({
    label: option,
    value: option,
  })),
  paragraphGap: paragraphGapOptions.map((option) => ({
    label: option,
    value: option,
  })),
}

export const ChapterStyleProvider = ({ children }: { children: ReactNode }) => {
  const defaultStyle = {
    fontSize: 16,
    fontFamily: 'nunito sans',
    lineHeight: 32,
    paragraphGap: 24,
  }

  const [isOpen, setIsOpen] = useState(false)
  const [styleSetting, setStyleSetting] =
    useState<ChapterStyleProperties>(defaultStyle)

  useEffect(() => {
    const isSetting = window.localStorage.getItem('style-setting')
    if (!isSetting) {
      window.localStorage.setItem('style-setting', JSON.stringify(defaultStyle))
      return
    }

    try {
      const setting = JSON.parse(isSetting)
      setStyleSetting(setting)
    } catch (error) {
      console.log('Setting parse error: ', error)
    }
  }, [])

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const changeSetting = (options: Partial<ChapterStyleProperties>) => {
    setStyleSetting((old) => ({ ...old, ...options }))
  }

  return (
    <ChapterStyleContext
      value={{
        closeModal: closeModal,
        openModal: openModal,
        isOpen: isOpen,
        updateStyle: changeSetting,
        saveStyle: (styleSetting: ChapterStyleProperties) => {
          window.localStorage.setItem(
            'style-setting',
            JSON.stringify(styleSetting)
          )
        },
        style: styleSetting,
      }}
    >
      {children}
      <ModalChapterStyle isOpen={isOpen} closeModal={closeModal} />
    </ChapterStyleContext>
  )
}
