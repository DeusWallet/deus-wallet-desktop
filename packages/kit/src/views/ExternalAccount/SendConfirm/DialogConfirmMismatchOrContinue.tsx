import { useMemo } from 'react';

import { useIntl } from 'react-intl';

import {
  Alert,
  Box,
  Dialog,
  HStack,
  Icon,
  Image,
  Pressable,
  Text,
  ToastManager,
  VStack,
} from '@deushq/components';
import { shortenAddress } from '@deushq/components/src/utils';
import type { IBaseExternalAccountInfo } from '@deushq/engine/src/dbs/simple/entity/SimpleDbEntityWalletConnect';
import { generateNetworkIdByChainId } from '@deushq/engine/src/managers/network';
import type { Account } from '@deushq/engine/src/types/account';
import type { Network } from '@deushq/engine/src/types/network';
import { IMPL_EVM } from '@deushq/shared/src/engine/engineConsts';
import debugLogger from '@deushq/shared/src/logger/debugLogger';
import platformEnv from '@deushq/shared/src/platformEnv';

import LogoDeus from '../../../../assets/onboarding/logo_deus.png';
import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { useNavigationActions } from '../../../hooks';
import { usePromiseResult } from '../../../hooks/usePromiseResult';
import { wait } from '../../../utils/helper';
import ExternalAccountImg from '../components/ExternalAccountImg';
import { useAddExternalAccount } from '../useAddExternalAccount';

import type { IConnectToWalletResult } from '../../../components/WalletConnect/useWalletConnectQrcodeModal';

export interface IDialogConfirmMismatchContinueInfo {
  myAddress: string;
  // eslint-disable-next-line react/no-unused-prop-types
  myChainId: string;
  peerAddress: string;
  peerChainId: string;
  accountInfo?: IBaseExternalAccountInfo | undefined;
  currentAccount: Account;
  currentNetwork: Network;
  isAddressMismatched: boolean;
  isChainMismatched: boolean;
  connectToWalletResult: IConnectToWalletResult;
}

export interface IDialogConfirmMismatchContinueProps
  extends IDialogConfirmMismatchContinueInfo {
  onClose?: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}
export function DialogConfirmMismatchOrContinue(
  props: IDialogConfirmMismatchContinueProps,
) {
  const intl = useIntl();
  const {
    onClose,
    onCancel,
    onSubmit,
    peerAddress,
    myAddress,
    peerChainId,
    // myChainId,
    accountInfo,
    currentAccount,
    currentNetwork,
    isAddressMismatched,
    isChainMismatched,
    connectToWalletResult,
  } = props;

  const { engine } = backgroundApiProxy;
  const { addExternalAccount } = useAddExternalAccount();
  const { openRootHome } = useNavigationActions();
  const { result: peerNetwork } = usePromiseResult(async () => {
    try {
      const networkId = generateNetworkIdByChainId({
        impl: IMPL_EVM,
        chainId: peerChainId,
      });
      return await engine.getNetwork(networkId);
    } catch (error) {
      debugLogger.common.error(error);
      return undefined;
    }
  }, [engine, peerChainId]);
  const msgId = useMemo(() => {
    if (isAddressMismatched && isChainMismatched) {
      return 'content__account_and_network_not_matched';
    }
    if (isAddressMismatched) {
      return 'content__account_is_not_matched';
    }
    if (isChainMismatched) {
      return 'content__chain_is_not_matched';
    }
  }, [isAddressMismatched, isChainMismatched]);
  return (
    <Dialog
      visible
      onClose={() => {
        onClose?.();
      }}
      contentProps={{
        // title: intl.formatMessage({ id: 'action__remove_account' }),
        // content: ''
        contentElement: (
          <VStack space={6} alignSelf="stretch">
            <Alert
              title={intl.formatMessage({
                id: msgId,
              })}
              alertType="info"
              dismiss={false}
            />
            <VStack>
              <HStack>
                <Image source={LogoDeus} borderRadius="6px" size={6} />
                <Text typography="Body1Strong" ml={3}>
                  Deus
                </Text>
              </HStack>
              <HStack justifyContent="space-between" py={3}>
                <Text typography="Body2Strong" color="text-subdued">
                  {intl.formatMessage({ id: 'form__account' })}
                </Text>
                <Text typography="Body2">{shortenAddress(myAddress)}</Text>
              </HStack>
              <HStack justifyContent="space-between" py={3}>
                <Text typography="Body2Strong" color="text-subdued">
                  {intl.formatMessage({ id: 'network__network' })}
                </Text>
                <Text typography="Body2">{currentNetwork.shortName}</Text>
              </HStack>
            </VStack>
            <VStack>
              <HStack>
                <ExternalAccountImg
                  accountId={currentAccount.id}
                  size={6}
                  radius="6px"
                />
                <Text typography="Body1Strong" ml={3}>
                  {accountInfo?.walletName || '3rd Wallet'}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" py={3}>
                <Text typography="Body2Strong" color="text-subdued">
                  {intl.formatMessage({ id: 'form__account' })}
                </Text>
                <Box>
                  <Text
                    typography="Body2"
                    color={
                      isAddressMismatched ? 'text-critical' : 'text-default'
                    }
                  >
                    {shortenAddress(peerAddress)}
                  </Text>
                  {platformEnv.isWeb &&
                  accountInfo?.type === 'injectedProvider' ? (
                    <Pressable
                      onPress={async () => {
                        onClose?.();
                        if (connectToWalletResult) {
                          await addExternalAccount(connectToWalletResult);
                          openRootHome();
                          await wait(600);
                          ToastManager.show({
                            title: intl.formatMessage({
                              id: 'msg__connect_and_switch',
                            }),
                          });
                        }
                      }}
                    >
                      <HStack justifyContent="flex-end">
                        <Text color="text-subdued">
                          {intl.formatMessage({ id: 'action__connect' })}
                        </Text>
                        <Icon
                          name="ChevronRightMini"
                          color="icon-subdued"
                          size={20}
                        />
                      </HStack>
                    </Pressable>
                  ) : null}
                </Box>
              </HStack>
              <HStack justifyContent="space-between" py={3}>
                <Text typography="Body2Strong" color="text-subdued">
                  {intl.formatMessage({ id: 'network__network' })}
                </Text>
                <Text
                  typography="Body2"
                  color={isChainMismatched ? 'text-critical' : 'text-default'}
                >
                  {peerNetwork?.shortName ||
                    (peerChainId ? `chainId=${peerChainId}` : '')}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        ),
      }}
      footerButtonProps={{
        primaryActionProps: {
          type: 'primary',
        },
        primaryActionTranslationId: 'action__continue',
        onPrimaryActionPress: () => {
          onSubmit();
          onClose?.();
        },
        onSecondaryActionPress: () => {
          onCancel();
          onClose?.();
        },
      }}
    />
  );
}
