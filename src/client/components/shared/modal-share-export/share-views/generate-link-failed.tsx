import { IconInfoHexagonFilled } from '@tabler/icons-react';
import { data } from 'react-router-dom';
import { Button } from '../../../atoms/button/index.tsx';
import { InnerAlert } from '../../inner-alert/index.tsx';
import S from '../style.module.css';
import type { FC } from '../../../../types/fc.ts';

interface Props {
  title?: string;
  message: string;
  onBack: () => void
}
export const GenerateLinkError: FC<Props> = ({
  title,
  message,
  onBack
}) => {
  return (
    <div className={S.share}>
      <InnerAlert.Error>
        <InnerAlert.Icon><IconInfoHexagonFilled /></InnerAlert.Icon>
        <InnerAlert.Details>
          <InnerAlert.Title>
            {title ?? 'Error generating link'}
          </InnerAlert.Title>
          <InnerAlert.Message>
            {message}
          </InnerAlert.Message>
        </InnerAlert.Details>
      </InnerAlert.Error>
      <Button variant='secondary' onClick={onBack}>Back</Button>
    </div>
  )
}