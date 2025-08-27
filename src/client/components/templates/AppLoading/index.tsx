import { App } from '../../atoms/App/index.tsx';
import S from './style.module.css';

export const AppLoading = () => {
  return (
    <App appTitle='Dragoid | Loading reader' className={S.app}>
      <p>
        <span>Loading Reader</span>
        <span className={S.dots}>.</span>
        <span className={S.dots}>.</span>
        <span className={S.dots}>.</span>
      </p>
    </App>
  )
}