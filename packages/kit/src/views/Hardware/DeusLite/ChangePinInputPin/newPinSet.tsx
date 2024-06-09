import type { FC } from 'react';

import { useNavigation, useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import type {
  DeusLiteChangePinRoutesParams,
  DeusLiteResetRoutesParams,
} from '@deushq/kit/src/routes';
import { DeusLiteChangePinModalRoutes } from '@deushq/kit/src/routes/routesEnum';
import type { ModalScreenProps } from '@deushq/kit/src/routes/types';

import HardwarePinCode from '../../BasePinCode';

import type { RouteProp } from '@react-navigation/core';

type NavigationProps = ModalScreenProps<DeusLiteResetRoutesParams> &
  ModalScreenProps<DeusLiteChangePinRoutesParams>;

const DeusLiteNewSetPinCode: FC = () => {
  const intl = useIntl();
  const route =
    useRoute<
      RouteProp<
        DeusLiteChangePinRoutesParams,
        DeusLiteChangePinModalRoutes.DeusLiteChangePinSetModal
      >
    >();

  const { currentPin } = route.params;

  const navigation = useNavigation<NavigationProps['navigation']>();

  return (
    <HardwarePinCode
      title={intl.formatMessage({ id: 'title__set_up_new_pin' })}
      description={intl.formatMessage({ id: 'title__set_up_new_pin_desc' })}
      securityReminder={intl.formatMessage({
        id: 'content__we_dont_store_any_of_your_information',
      })}
      onComplete={(pinCode) => {
        navigation.navigate(
          DeusLiteChangePinModalRoutes.DeusLiteChangePinRepeatModal,
          { currentPin, newPin: pinCode },
        );
        return Promise.resolve('');
      }}
    />
  );
};

export default DeusLiteNewSetPinCode;
