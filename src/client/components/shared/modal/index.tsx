import S from './style.module.css';
import { createPortal } from 'react-dom';
import { useEffect, type ComponentProps, useState } from 'react';
import { cn } from '../../../utils/cn.ts';


interface RootProps extends ComponentProps<'div'> {
  isOpen: boolean
}

interface HeaderProps extends ComponentProps<'div'> { }
interface HeaderGroupProps extends ComponentProps<'div'> { }
interface WrapperProps extends ComponentProps<'div'> { }
interface ContentProps extends ComponentProps<'div'> { }
interface ButtonProps extends ComponentProps<'button'> { }
interface TitleProps extends ComponentProps<'h3'> { }

// ================================================
// Modal Root
// ================================================
const Root = ({ isOpen, ...props }: RootProps) => {

  const [overflow, setOverflow] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setOverflow(document.body.style.overflow)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = overflow;
    }

    return () => {
      document.body.style.overflow = overflow;
    }
  }, [isOpen])

  return createPortal(
    <div {...props} data-hidden={!isOpen} className={cn(S.modal, props.className)}>
      {props.children}
    </div>,
    document.body
  )
}

// ================================================
// Modal Wrapper
// ================================================
const Wrapper = ({ ...props }: WrapperProps) => {
  return (
    <div {...props} className={[S.wrapper, props.className].join(" ")}>
      {props.children}
    </div>
  )
}

// ================================================
// Modal Header
// ================================================
const Header = ({ ...props }: HeaderProps) => {
  return (
    <div {...props} className={[S.header, props.className].join(" ")}>
      {props.children}
    </div>
  )
}

// ================================================
// Modal Header Group
// ================================================

const HeaderGroup = ({ ...props }: HeaderGroupProps) => {
  return (
    <div {...props} className={[S.header_group, props.className].join(" ")}>
      {props.children}
    </div>
  )
}

// ================================================
// Modal Title
// ================================================
const Title = ({ ...props }: TitleProps) => {
  return (
    <h3 {...props} className={[S.title, props.className].join(" ")}>
      {props.children}
    </h3>
  )
}

// ================================================
// Modal Close Button
// ================================================
const CloseButton = ({ ...props }: ButtonProps) => {
  return (
    <button {...props} className={[S.button, props.className].join(" ")}>
      {props.children}
    </button>
  )
}

// ================================================
// Modal Content
// ================================================
const Content = ({ ...props }: ContentProps) => {
  return (
    <div {...props} className={[S.content, props.className].join(" ")}>
      {props.children}
    </div>
  )
}

export const Modal = Object.freeze({
  Root,
  Wrapper,
  Header,
  HeaderGroup,
  Title,
  CloseButton,
  Content,
})