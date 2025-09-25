import S from './style.module.css';
import { App } from "../../components/atoms/App/index.tsx"
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {

  const navigate = useNavigate()

  return (
    <App className={S.app} appTitle='Dragoid | Page not found'>
      <section className={S.container}>
        <h1>Page Not Found</h1>
        <p>It looks like the content you’re trying to access doesn’t exist or the request is invalid.</p>
        <button onClick={() => navigate('/')}>Back main page</button>
      </section>
    </App>
  )
}