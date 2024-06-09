/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { ComponentProps, FC } from 'react';

import { useIntl } from 'react-intl';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import ConfirmOnClassic from '@deushq/kit/assets/animations/confirm-on-deus-classic.json';
import ConfirmOnMini from '@deushq/kit/assets/animations/confirm-on-deus-mini.json';
import ConfirmOnPro from '@deushq/kit/assets/animations/confirm-on-deus-pro.json';
import ConfirmOnTouch from '@deushq/kit/assets/animations/confirm-on-deus-touch.json';
import EnterPinCodeOnClassic from '@deushq/kit/assets/animations/enter-pin-code-on-deus-classic.json';
import EnterPinCodeOnMini from '@deushq/kit/assets/animations/enter-pin-code-on-deus-mini.json';
import EnterPinCodeOnPro from '@deushq/kit/assets/animations/enter-pin-code-on-deus-pro.json';
import EnterPinCodeOnTouch from '@deushq/kit/assets/animations/enter-pin-code-on-deus-touch.json';

import Box from '../Box';
import LottieView from '../LottieView';
import Text from '../Text';

import ActionToast from './ActionToast';
import BaseToast from './BaseToast';

type Props = ComponentProps<typeof Toast>;

const getConfirmAnimation = (type: string) => {
  switch (type) {
    case 'mini':
      return ConfirmOnMini;
    case 'touch':
      return ConfirmOnTouch;
    case 'pro':
      return ConfirmOnPro;
    default:
      return ConfirmOnClassic;
  }
};

const getEnterPinCodeAnimation = (type: string) => {
  switch (type) {
    case 'mini':
      return EnterPinCodeOnMini;
    case 'touch':
      return EnterPinCodeOnTouch;
    case 'pro':
      return EnterPinCodeOnPro;
    default:
      return EnterPinCodeOnClassic;
  }
};

const CustomToast: FC<Props> = (outerProps) => {
  const intl = useIntl();

  return (
    <Toast
      config={{
        default: (props) => (
          <BaseToast
            {...props}
            bgColorToken="surface-neutral-default"
            borderColorToken="border-default"
            shadowColorToken="text-default"
            textColorToken="text-default"
          />
        ),
        success: (props) => (
          <BaseToast
            {...props}
            bgColorToken="interactive-default"
            textColorToken="text-on-primary"
          />
        ),
        error: (props) => (
          <BaseToast
            {...props}
            bgColorToken="action-critical-default"
            textColorToken="text-on-critical"
          />
        ),
        action: (props) => <ActionToast {...props} />,
        enterPinOnDevice: ({ props }) => (
          <Box px={6} w="full" maxW="374">
            <Box
              w="full"
              mx="auto"
              p={4}
              pb={6}
              rounded="xl"
              bgColor="surface-default"
              borderWidth={StyleSheet.hairlineWidth}
              borderColor="border-subdued"
              shadow="depth.4"
              {...props}
            >
              <LottieView
                source={getEnterPinCodeAnimation(props?.deviceType)}
                autoPlay
                loop
                style={{ width: '100%' }}
              />
              <Text
                typography="DisplayMedium"
                mt={6}
                textAlign="center"
                color="text-default"
              >
                {intl.formatMessage({ id: 'modal__input_pin_code' })}
              </Text>
            </Box>
          </Box>
        ),
        confirmOnDevice: ({ props }) => (
          <Box px={6} w="full" maxW="374">
            <Box
              mx="auto"
              p={4}
              pb={6}
              rounded="xl"
              bgColor="surface-default"
              borderWidth={StyleSheet.hairlineWidth}
              borderColor="border-subdued"
              shadow="depth.4"
              {...props}
            >
              <LottieView
                source={getConfirmAnimation(props?.deviceType)}
                autoPlay
                loop
                style={{ width: '100%' }}
              />
              <Text
                typography="DisplayMedium"
                mt={6}
                textAlign="center"
                color="text-default"
              >
                {intl.formatMessage({ id: 'modal__confirm_on_device' })}
              </Text>
            </Box>
          </Box>
        ),
      }}
      {...outerProps}
    />
  );
};

export default CustomToast;
