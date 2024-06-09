import type { FC } from 'react';

import { useNavigation, useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import type { CreateWalletRoutesParams } from '@deushq/kit/src/routes/Root/Modal/CreateWallet';
import { CreateWalletModalRoutes } from '@deushq/kit/src/routes/routesEnum';
import type { ModalScreenProps } from '@deushq/kit/src/routes/types';

import HardwarePinCode from '../../BasePinCode';

import type { RouteProp } from '@react-navigation/core';

type NavigationProps = ModalScreenProps<CreateWalletRoutesParams>;

type RouteProps = RouteProp<
  CreateWalletRoutesParams,
  CreateWalletModalRoutes.DeusLiteBackupPinCodeVerifyModal
>;

const DeusLitePinCode: FC = () => {
  const intl = useIntl();

  const navigation = useNavigation<NavigationProps['navigation']>();
  const route = useRoute<RouteProps>();
  const { walletId, backupData, onSuccess } = route.params;

  return (
    <HardwarePinCode
      title={intl.formatMessage({ id: 'title__deus_lite_pin' })}
      description={intl.formatMessage({
        id: 'content__enter_deus_lite_pin_to_continue',
      })}
      securityReminder={intl.formatMessage({
        id: 'content__we_dont_store_any_of_your_information',
      })}
      onComplete={(pinCode) => {
        navigation.replace(CreateWalletModalRoutes.DeusLiteBackupModal, {
          walletId,
          pinCode,
          backupData,
          onSuccess,
        });
        return Promise.resolve(true);
      }}
    />
  );
};

export default DeusLitePinCode;
