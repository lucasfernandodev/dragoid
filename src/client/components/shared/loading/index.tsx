import type { FC } from '../../../types/fc.ts'
import S from './style.module.css'

interface Props {
  variant?: 'primary' | 'secondary'
}
export const Loading: FC<Props> = ({ variant = 'primary' }) => {
  return <span data-variant={variant} className={S.spinner}></span>
}
