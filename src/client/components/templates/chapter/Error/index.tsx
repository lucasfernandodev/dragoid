import {
  IconArrowLeft,
  IconExclamationCircle,
  IconHome,
  IconRefresh,
} from '@tabler/icons-react'
import type { FC } from '../../../../types/fc.ts'
import { App } from '../../../atoms/App/index.tsx'
import S from './style.module.css'
import { Link, useNavigate } from 'react-router-dom'

interface ChapterErrorProps {
  title: string
  description: string
}

export const ChapterError: FC<ChapterErrorProps> = ({ title, description }) => {
  const navigate = useNavigate()

  return (
    <App appTitle={`Dragoid | ${title}`} className={S.app}>
      <div className={S.container}>
        <div className={S.icon}>
          <IconExclamationCircle />
        </div>
        <div className={S.heading}>
          <h1 className={S.title}>{title}</h1>
          <p className={S.desc}>{description}</p>
        </div>

        <div className={S.actions_group}>
          <button className={S.btn} onClick={() => window.location.reload()}>
            <IconRefresh />
            <span>Try Again</span>
          </button>
          <button className={S.btn} onClick={() => navigate(-1)}>
            <IconArrowLeft />
            <span>Go Back</span>
          </button>
          <button className={S.btn} onClick={() => navigate('/')}>
            <IconHome />
            <span>Home</span>
          </button>
        </div>

        <div className={S.footer}>
          <p>
            Think this error shouldn't appear? Let us know by{' '}
            <Link
              to="https://github.com/lucasfernandodev/dragoid/issues"
              target="_blank"
            >
              opening an issue
            </Link>{' '}
            on GitHub!
          </p>
        </div>
      </div>
    </App>
  )
}
