import type { ComponentProps } from 'react';
import S from './style.module.css';
import type { FC } from '../../../types/fc.ts';
import { cn } from '../../../utils/cn.ts';

type AlertTypes = 'Error'

type Error = ComponentProps<'div'>

const Error: FC<ComponentProps<'div'>> = ({ ...props }) => {
  return (
    <div data-variant="error" className={cn(S.alert, props.className)}>
      {props.children}
    </div>
  )
}

const Icon: FC<ComponentProps<'div'>> = ({ ...props }) => {
  return (
    <div data-variant="error" className={cn(S.icon, props.className)}>
      {props.children}
    </div>
  )
}

const Details: FC<ComponentProps<'div'>> = ({ ...props }) => {
  return (
    <div data-variant="error" className={cn(S.details, props.className)}>
      {props.children}
    </div>
  )
}

const Title: FC<ComponentProps<'h3'>> = ({ ...props }) => {
  return (
    <h3 data-variant="error" className={cn(S.title, props.className)}>
      {props.children}
    </h3>
  )
}

const Message: FC<ComponentProps<'p'>> = ({ ...props }) => {
  return (
    <p data-variant="error" className={cn(S.message, props.className)}>
      {props.children}
    </p>
  )
}


export const InnerAlert = Object.freeze({
  Error,
  Icon,
  Details,
  Title,
  Message
})