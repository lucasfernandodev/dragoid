import { Link, useNavigate } from 'react-router-dom';
import S from './style.module.css';
import { App } from '../../../atoms/App/index.tsx';
import { IconRefresh, IconArrowLeft, IconHome, IconError404 } from '@tabler/icons-react';

export const ChapterNotFound = () => {
  const navigate = useNavigate();

  return (
    <App appTitle='Dragoid | Chapter Not Found' className={S.app}>


      <div className={S.container}>
        <div className={S.icon}>
          <IconError404 />
        </div>
        <div className={S.heading}>
          <h1 className={S.title}>Chapter not found</h1>
          <p className={S.desc}>The chapter you’re looking for doesn’t exist or is unavailable at the moment.</p>
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
          <button className={S.btn} onClick={() => navigate("/")}>
            <IconHome />
            <span>Home</span>
          </button>
        </div>

        <div className={S.footer}>
          <p>
            Think this error shouldn't appear? Let us know by <Link to="https://github.com/lucasfernandodev/dragoid/issues" target='_blank'>opening an issue</Link> on GitHub!
          </p>
        </div>
      </div>
    </App>
  )
}