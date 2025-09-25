import { IconArrowLeft, IconHome, IconReload } from '@tabler/icons-react';
import type { FC } from '../../../../../types/front-end/fc.ts';
import { App } from '../../../atoms/App/index.tsx';
import S from './style.module.css';
import { useNavigate } from 'react-router-dom';

interface ChapterErrorProps {
  title: string;
  description: string;
}

export const ChapterError: FC<ChapterErrorProps> = ({
  title,
  description
}) => {

  const navigate = useNavigate()

  return (
    <App appTitle={`Dragoid | Chapter loading error`} className={S.app}>
      <div className={S.container}>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className={S.group_buttons}>
          <button className={S.btn} onClick={() => navigate(-1)}>
            <IconArrowLeft />
            <span>Voltar para pagina anterior</span>
          </button>
          <button className={S.btn} onClick={() => navigate("/")}>
            <IconHome />
            <span>Back to main page</span>
          </button>
          <button className={S.btn} onClick={() => window.location.reload()}>
            <IconReload />
            <span>try again</span>
          </button>
        </div>
      </div>
    </App>
  )
}