import type { FC } from 'react';

import { deviceUtils } from '@deushq/kit/src/utils/hardware';

import EnablePassphraseDialog from '../Deus/EnablePassphraseDialog';

type HandlerOpenPassphraseViewProps = {
  deviceConnectId: string;
  onClose: () => void;
};

const HandlerOpenPassphraseView: FC<HandlerOpenPassphraseViewProps> = ({
  deviceConnectId,
  onClose,
}) => (
  <EnablePassphraseDialog
    deviceConnectId={deviceConnectId}
    onClose={onClose}
    onSuccess={onClose}
    onError={(e) => {
      deviceUtils.showErrorToast(e);
      onClose?.();
    }}
  />
);

export default HandlerOpenPassphraseView;
