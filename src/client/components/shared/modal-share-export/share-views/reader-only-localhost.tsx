import { Button } from '../../../atoms/button/index.tsx'
import S from '../style.module.css'
import type { FC } from '../../../../types/fc.ts'

interface Props {
  message: string
  onBack: () => void
}

export const ReaderOnlyLocalhost: FC<Props> = ({ message, onBack }) => {
  return (
    <div className={S.share}>
      <div className={S.qrcode}>
        <p>{message}</p>
      </div>
      <div className={S.group_button}>
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  )
}
