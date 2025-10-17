import { IconDeviceFloppy, IconPalette, IconX } from '@tabler/icons-react';
import { Select } from '../Select/index.tsx';
import { Modal } from '../modal/index.tsx';
import S from './style.module.css';
import { useChapterStyle } from '../../../hooks/useChapterStyle.tsx';
import { ChapterStyleSelectOptions } from '../../../context/chapter-style/provider.tsx';
import { Loading } from '../loading/index.tsx';
import { useState } from 'react';
import { Button } from '../../atoms/button/index.tsx';

interface ModalChapterStyleProps {
  isOpen: boolean,
  closeModal: () => void;
}

export const ModalChapterStyle = ({ closeModal, isOpen }: ModalChapterStyleProps) => {

  const [isLoading, setIsLoading] = useState(false);
  const { style, saveStyle, updateStyle } = useChapterStyle()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    saveStyle(style)
    setTimeout(() => {
      setIsLoading(false)
    }, 150)
  }

  const { fontFamily, fontSize, lineHeight, paragraphGap } = ChapterStyleSelectOptions

  return (
    <Modal.Root isOpen={isOpen}>
      <Modal.Wrapper className={S.modal_wrapper}>
        <Modal.Header>
          <Modal.HeaderGroup>
            <IconPalette />
            <Modal.Title className={S.modal_title}>
              Chapter Style
            </Modal.Title>
          </Modal.HeaderGroup>
          <Modal.CloseButton onClick={closeModal}>
            <IconX />
          </Modal.CloseButton>
        </Modal.Header>
        <Modal.Content>
          <form className={S.form} onSubmit={onSubmit}>
            <div className={S.group}>
              <label htmlFor="font-size">Font size</label>
              <Select
                className={{ select: S.select, option: S.select_option }}
                placeholder='font size'
                values={fontSize}
                defaultValue={fontSize.filter(
                  opt => opt.value === style.fontSize
                )[0]}
                onChange={opt => updateStyle({ fontSize: opt.value })}
              />
            </div>
            <div className={S.group}>
              <label htmlFor="font-family">Font family</label>
              <Select
                className={{ select: S.select, option: S.select_option }}
                placeholder='font family'
                values={fontFamily}
                defaultValue={fontFamily.filter(
                  opt => opt.value === style.fontFamily
                )[0]}
                onChange={opt => updateStyle({ fontFamily: opt.value })}
              />
            </div>
            <div className={S.group}>
              <label htmlFor="line-height">Line height</label>
              <Select
                className={{ select: S.select, option: S.select_option }}
                placeholder='line height'
                values={lineHeight}
                defaultValue={lineHeight.filter(
                  opt => opt.value === style.lineHeight
                )[0]}
                onChange={opt => updateStyle({ lineHeight: opt.value })}
              />
            </div>
            <div className={S.group}>
              <label htmlFor="paragraph-gap">Paragraph gap</label>

              <Select
                className={{ select: S.select, option: S.select_option }}
                placeholder='paragraph gap'
                values={paragraphGap}
                defaultValue={paragraphGap.filter(
                  opt => opt.value === style.paragraphGap
                )[0]}
                onChange={opt => updateStyle({ paragraphGap: opt.value })}
              />
            </div>
            <div className={S.actions}>
              <Button className={S.button} data-disabled={isLoading}>
                {isLoading ? <Loading /> : (
                  <>
                    <IconDeviceFloppy className={S.icon} />
                    <span>Save</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Modal.Content>
      </Modal.Wrapper>
    </Modal.Root>
  )
}