import { IconRefresh, IconServerOff } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { App } from '../../atoms/App/index.tsx'
import S from './style.module.css'

export const ServerOfflineTemplate = () => {
  return (
    <App appTitle="Dragoid | Server offline" className={S.app}>
      <div className={S.container}>
        <div className={S.icon}>
          <IconServerOff />
        </div>
        <div className={S.heading}>
          <h1 className={S.title}>Server Offline</h1>
          <p className={S.desc}>
            The server isn’t responding. Make sure it’s running and check your
            connection before trying again.
          </p>
        </div>

        <div className={S.actions_group}>
          <button className={S.btn} onClick={() => window.location.reload()}>
            <IconRefresh />
            <span>Refresh</span>
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
