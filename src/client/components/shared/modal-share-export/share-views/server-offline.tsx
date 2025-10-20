import { IconInfoHexagonFilled } from '@tabler/icons-react';
import { data } from 'react-router-dom';
import { Button } from '../../../atoms/button/index.tsx';
import { InnerAlert } from '../../inner-alert/index.tsx';
import S from '../style.module.css';
import type { FC } from '../../../../types/fc.ts';

interface Props {
  onBack: () => void
}
export const ServerOffline: FC<Props> = ({
  onBack
}) => {
  return (
    <div className={S.share}>
      <InnerAlert.Error>
        <InnerAlert.Icon><IconInfoHexagonFilled /></InnerAlert.Icon>
        <InnerAlert.Details>
          <InnerAlert.Title>
            Server Offline
          </InnerAlert.Title>
          <InnerAlert.Message>
            The server isn’t responding. Make sure it’s running and check your connection before trying again.
          </InnerAlert.Message>
        </InnerAlert.Details>
      </InnerAlert.Error>
      <Button variant='secondary' onClick={onBack}>Back</Button>
    </div>
  )
}