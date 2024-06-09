import type { FC } from 'react';
import { useCallback } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Column } from 'native-base';
import { useIntl } from 'react-intl';

import { Modal } from '@deushq/components';
import type { BackupWalletRoutesParams } from '@deushq/kit/src/routes/Root/Modal/BackupWallet';
import { BackupWalletModalRoutes } from '@deushq/kit/src/routes/routesEnum';
import type { ModalScreenProps } from '@deushq/kit/src/routes/types';
import supportedNFC from '@deushq/shared/src/detector/nfc';

import { useWallet } from '../../hooks/useWallet';
import { KeyTagRoutes } from '../KeyTag/Routes/enums';
import {
  OptionKeyTag,
  OptionDeusLite,
  OptionRecoveryPhrase,
} from '../Onboarding/screens/ImportWallet/ImportWalletOptions';

import type { IKeytagRoutesParams } from '../KeyTag/Routes/types';
import type { RouteProp } from '@react-navigation/core';

export type BackupWalletViewProps = {
  walletId: string;
};

type RouteProps = RouteProp<
  BackupWalletRoutesParams,
  BackupWalletModalRoutes.BackupWalletOptionsModal
>;

type NavigationProps = ModalScreenProps<
  BackupWalletRoutesParams & IKeytagRoutesParams
>;

const BackupWalletOptionsView: FC<BackupWalletViewProps> = () => {
  const intl = useIntl();
  const { walletId } = useRoute<RouteProps>().params;
  const navigation = useNavigation<NavigationProps['navigation']>();
  const { wallet } = useWallet({ walletId });
  const onManual = useCallback(() => {
    navigation.navigate(BackupWalletModalRoutes.BackupWalletManualModal, {
      walletId,
    });
  }, [navigation, walletId]);

  const onLite = useCallback(() => {
    navigation.navigate(BackupWalletModalRoutes.BackupWalletLiteModal, {
      walletId,
    });
  }, [navigation, walletId]);

  const onKeyTag = useCallback(() => {
    navigation.navigate(KeyTagRoutes.KeyTagVerifyPassword, {
      walletId,
      wallet,
    });
  }, [navigation, wallet, walletId]);

  return (
    <Modal
      header={intl.formatMessage({ id: 'action__backup' })}
      footer={null}
      scrollViewProps={{
        children: (
          <Column space={4} p={0.5}>
            <OptionRecoveryPhrase
              icon="PencilOutline"
              title={intl.formatMessage({ id: 'backup__manual_backup' })}
              description={intl.formatMessage({
                id: 'backup__manual_backup_desc',
              })}
              onPress={onManual}
            />
            {supportedNFC && (
              <OptionDeusLite
                title={intl.formatMessage({ id: 'backup__deus_lite_backup' })}
                description={intl.formatMessage({
                  id: 'backup__deus_lite_backup_desc',
                })}
                onPress={onLite}
              />
            )}
            <OptionKeyTag
              title={intl.formatMessage({ id: 'form__deus_keytag' })}
              description={intl.formatMessage({
                id: 'form__record_your_recovery_phrase_like_a_dot_punching_game',
              })}
              onPress={onKeyTag}
            />
          </Column>
        ),
      }}
    />
  );
};

export default BackupWalletOptionsView;
