import S from './style.module.css';
import { App } from "../../components/atoms/App/index.tsx"
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {

  const to = useNavigate()

  return (
    <App className={S.app} appTitle='Dragoind | Page not found'>
      <section className={S.container}>
        <h1>Page Not Found</h1>
        <button onClick={() => to('/')}>Return to home</button>
      </section>
    </App>
  )
}