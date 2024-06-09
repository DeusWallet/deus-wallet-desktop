import type { FC } from 'react';

import { useIntl } from 'react-intl';

import { LottieView, Text } from '@deushq/components';
import ConfirmOnClassic from '@deushq/kit/assets/animations/confirm-on-deus-classic.json';
import ConfirmOnMini from '@deushq/kit/assets/animations/confirm-on-deus-mini.json';
import ConfirmOnPro from '@deushq/kit/assets/animations/confirm-on-deus-pro.json';
import ConfirmOnTouch from '@deushq/kit/assets/animations/confirm-on-deus-touch.json';

import BaseRequestView from './BaseRequest';

import type { BaseRequestViewProps } from './BaseRequest';
import type { IDeviceType } from '@deusfe/hd-core';

const getConfirmAnimation = (type: IDeviceType) => {
  switch (type) {
    case 'classic1s':
    case 'classic':
      return ConfirmOnClassic;
    case 'mini':
      return ConfirmOnMini;
    case 'touch':
      return ConfirmOnTouch;
    case 'pro':
      return ConfirmOnPro;
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-case-declarations
      const checkType: never = type;
  }
};

type RequestConfirmViewProps = {
  deviceType: IDeviceType;
  bootLoader?: boolean;
} & Omit<BaseRequestViewProps, 'children'>;

const RequestConfirmView: FC<RequestConfirmViewProps> = ({
  deviceType,
  bootLoader,
  ...props
}) => {
  const intl = useIntl();
  const isPro = deviceType === 'pro';
  return (
    <BaseRequestView {...props} alignItems="center">
      <LottieView
        source={getConfirmAnimation(deviceType)}
        autoPlay
        loop
        style={{ width: isPro ? '60%' : '100%' }}
      />

      <Text
        typography="DisplayMedium"
        mt={6}
        textAlign="center"
        color="text-default"
      >
        {bootLoader
          ? intl.formatMessage({ id: 'msg__firmware_is_being_upgraded' })
          : intl.formatMessage({ id: 'modal__confirm_on_device' })}
      </Text>
    </BaseRequestView>
  );
};

export default RequestConfirmView;
