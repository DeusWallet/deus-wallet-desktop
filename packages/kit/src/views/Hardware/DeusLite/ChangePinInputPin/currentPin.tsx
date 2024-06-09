import type { FC } from 'react';

import { useNavigation } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import type { DeusLiteChangePinRoutesParams } from '@deushq/kit/src/routes';
import { DeusLiteChangePinModalRoutes } from '@deushq/kit/src/routes/routesEnum';
import type { ModalScreenProps } from '@deushq/kit/src/routes/types';

import HardwarePinCode from '../../BasePinCode';

type NavigationProps = ModalScreenProps<DeusLiteChangePinRoutesParams>;

const DeusLiteCurrentPinCode: FC = () => {
  const intl = useIntl();

  const navigation = useNavigation<NavigationProps['navigation']>();

  return (
    <HardwarePinCode
      title={intl.formatMessage({ id: 'title__enter_current_pin' })}
      description={intl.formatMessage({ id: 'title__enter_current_pin_desc' })}
      securityReminder={intl.formatMessage({
        id: 'content__we_dont_store_any_of_your_information',
      })}
      onComplete={(pinCode) => {
        navigation.navigate(
          DeusLiteChangePinModalRoutes.DeusLiteChangePinSetModal,
          { currentPin: pinCode },
        );
        return Promise.resolve('');
      }}
    />
  );
};

export default DeusLiteCurrentPinCode;
