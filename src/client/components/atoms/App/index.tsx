import { cn } from '../../../utils/cn.ts';
import S from './style.module.css';
import { useEffect, type ComponentProps, type RefObject } from 'react';

interface Props extends ComponentProps<'main'> {
  appTitle?: string;
  ref?: RefObject<HTMLElement | null>;
}

export const App = ({ appTitle, ...props }: Props) => {
  useEffect(() => {
    if (appTitle) {
      document.title = appTitle
    }
  }, [appTitle])

  return (
    <main {...props} className={cn(props.className, S.app)} ref={props.ref}>
      {props.children}
    </main>
  )
}