import { useNavigate } from 'react-router-dom';
import S from './style.module.css';
import { App } from '../../../atoms/App/index.tsx';

export const ChapterNotFound = () => {
  const navigate = useNavigate();

  return (
    <App appTitle='Dragoid | Chapter Not Found' className={S.app}>
      <section className={S.notfound}>
        <h1>Chapter not found</h1>
        <p>It appears the chapter you are trying to access does not exist or the request is invalid.</p>
        <button className={S.button} onClick={() => navigate('/')}>
          Return to home
        </button>
      </section>
    </App>
  )
}