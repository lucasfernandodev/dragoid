import {
  IconCircleCheckFilled,
  IconDownload,
  IconInfoHexagonFilled,
} from '@tabler/icons-react'
import { InnerAlert } from '../inner-alert/index.tsx'
import S from './style.module.css'
import { Loading } from '../loading/index.tsx'
import { useFetch } from '../../../hooks/useFetch.ts'
import { downloadNovel } from '../../../api/download-novel.ts'
import { useEffect, useState } from 'react'
import { downloadFile } from '../../../utils/download-file.ts'
import { hasApiError } from '../../../utils/has-api-error.ts'
import type { FC } from '../../../types/fc.ts'

interface IResponseErrorViewProps {
  title: string
  message: string
}

const ResponseErrorView: FC<IResponseErrorViewProps> = ({ title, message }) => {
  return (
    <InnerAlert.Error>
      <InnerAlert.Icon>
        <IconInfoHexagonFilled />
      </InnerAlert.Icon>
      <InnerAlert.Details>
        <InnerAlert.Title>{title}</InnerAlert.Title>
        <InnerAlert.Message>{message}</InnerAlert.Message>
      </InnerAlert.Details>
    </InnerAlert.Error>
  )
}

const ServerOfflineView = () => {
  return (
    <InnerAlert.Error>
      <InnerAlert.Icon>
        <IconInfoHexagonFilled />
      </InnerAlert.Icon>
      <InnerAlert.Details>
        <InnerAlert.Title>Server Offline</InnerAlert.Title>
        <InnerAlert.Message>
          The server isn’t responding. Make sure it’s running and check your
          connection before trying again.
        </InnerAlert.Message>
      </InnerAlert.Details>
    </InnerAlert.Error>
  )
}

const SuccessView = () => {
  return (
    <li className={S.item_success}>
      <div className={S.icon}>
        <IconCircleCheckFilled />
      </div>
      <h3>File generated success!</h3>
      <p>Your book has been successfully downloaded. Enjoy your reading!</p>
    </li>
  )
}

const LoadingView = () => {
  return (
    <li className={S.item_loading} tabIndex={1}>
      <Loading variant="secondary" />
      <span>Processing...</span>
    </li>
  )
}

interface IDefaultViewProps {
  onDownload: () => void
  format: 'epub' | 'json'
}

const DefaultView = ({ onDownload, format }: IDefaultViewProps) => {
  return (
    <li onClick={onDownload} className={S.item} tabIndex={1}>
      <div className={S.icon}>
        <div className={S.frame}>
          <IconDownload />
        </div>
      </div>
      <div className={S.details}>
        <h3>Download {format.toUpperCase()}</h3>
        <p>Export your novel as a {format.toUpperCase()} file</p>
      </div>
    </li>
  )
}

interface IExportFileProps {
  format: 'json' | 'epub'
}

export const ExportNovelOption: FC<IExportFileProps> = ({ format }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const { data, isLoading, isFetching, runQuery, success } = useFetch({
    queryFn: async () => await downloadNovel({ format }),
    queryKey: ['download-json'],
    isEnabled: false,
  })

  useEffect(() => {
    if (isLoading || !data || !data?.success || hasApiError(data)) return

    const { filename, file } = data
    downloadFile(filename, file)
    setDownloadSuccess(true)
  }, [isLoading, isFetching, data])

  if (isLoading && isFetching) return <LoadingView />

  if (!isLoading && !success) return <ServerOfflineView />

  if (!isLoading && !data?.success && hasApiError(data)) {
    return (
      <ResponseErrorView
        message={data?.error?.message}
        title={data?.error?.title || 'Generated novel for download failed'}
      />
    )
  }

  if (downloadSuccess) return <SuccessView />

  return <DefaultView format={format} onDownload={runQuery} />
}
