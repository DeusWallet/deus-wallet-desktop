import { memo, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Center } from '@deushq/components';
import type { INetwork, IWallet } from '@deushq/engine/src/types';
import LNHardwareWalletAuth from '@deushq/kit/src/views/LightningNetwork/components/LNHardwareWalletAuth';
import RefreshLightningNetworkToken from '@deushq/kit/src/views/LightningNetwork/RefreshLightningNetworkToken';
import { isLightningNetworkByNetworkId } from '@deushq/shared/src/engine/engineConsts';
import { isHardwareWallet } from '@deushq/shared/src/engine/engineUtils';
import platformEnv from '@deushq/shared/src/platformEnv';

import backgroundApiProxy from '../../background/instance/backgroundApiProxy';
import Protected, { ValidationFields } from '../../components/Protected';

function WalletTabsWithAuthCmp({
  children,
  wallet,
  network,
  networkId,
  accountId,
}: {
  children: any;
  wallet: IWallet;
  network: INetwork;
  networkId: string;
  accountId: string;
}) {
  const intl = useIntl();
  const isLightningNetwork = useMemo(
    () => isLightningNetworkByNetworkId(networkId),
    [networkId],
  );
  const isHwWallet = isHardwareWallet({ walletId: wallet.id });
  if (isLightningNetwork && isHwWallet) {
    return (
      <LNHardwareWalletAuth
        walletId={wallet.id}
        networkId={networkId}
        accountId={accountId}
      >
        {children}
      </LNHardwareWalletAuth>
    );
  }
  return (
    <Center w="full" h="full">
      <Protected
        walletId={wallet.id}
        networkId={network.id}
        field={ValidationFields.Account}
        placeCenter={!platformEnv.isNative}
        subTitle={intl.formatMessage(
          {
            id: 'title__password_verification_is_required_to_view_account_details_on_str',
          },
          { '0': network.name },
        )}
        checkIsNeedPassword={
          isLightningNetwork
            ? () =>
                backgroundApiProxy.serviceLightningNetwork.checkAuth({
                  networkId,
                  accountId,
                })
            : undefined
        }
      >
        {(password) => (
          <>
            <RefreshLightningNetworkToken
              walletId={wallet.id}
              accountId={accountId}
              password={password}
              networkId={network.id}
            />
            {children}
          </>
        )}
      </Protected>
    </Center>
  );
}

export const WalletTabsWithAuth = memo(WalletTabsWithAuthCmp);
