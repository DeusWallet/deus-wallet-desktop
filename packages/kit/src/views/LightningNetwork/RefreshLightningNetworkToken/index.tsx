import { useEffect } from 'react';

import { useIntl } from 'react-intl';

import { ToastManager } from '@deushq/components';
import { DeusNetwork } from '@deushq/shared/src/config/networkIds';
import { isHdWallet } from '@deushq/shared/src/engine/engineUtils';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';

export default function RefreshLightningNetworkToken({
  walletId,
  networkId,
  accountId,
  password,
}: {
  walletId: string;
  networkId: string;
  accountId: string;
  password: string;
}) {
  const intl = useIntl();
  useEffect(() => {
    if (isHdWallet({ walletId }) && !password) {
      return;
    }
    if (
      !networkId ||
      ![DeusNetwork.lightning, DeusNetwork.tlightning].includes(networkId)
    ) {
      return;
    }
    backgroundApiProxy.serviceLightningNetwork
      .refreshToken({
        networkId,
        accountId,
        password,
      })
      .then(() => {
        debugLogger.common.info('refresh lightning network token success');
      })
      .catch((e) => {
        ToastManager.show(
          {
            title: intl.formatMessage({
              id: 'msg__authentication_failed_verify_again',
            }),
          },
          {
            type: 'error',
          },
        );
        debugLogger.common.info('refresh lightning network token failed: ', e);
      });
    debugLogger.common.info('should refresh lightning network token');
  }, [password, walletId, networkId, accountId, intl]);
  return null;
}
