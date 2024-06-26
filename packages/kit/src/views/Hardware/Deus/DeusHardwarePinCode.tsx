import type { FC } from 'react';
import { useState } from 'react';

import { useRoute } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { useIntl } from 'react-intl';

import {
  Box,
  Button,
  HStack,
  Input,
  LottieView,
  Modal,
  Typography,
  VStack,
} from '@deushq/components';
import DeusMiniEnterPin from '@deushq/kit/assets/animations/lottie_hardware_deus_classic_enter_pin_code.json';
// import DeusClassicEnterPin from '@deushq/kit/assets/animations/lottie_hardware_deus_mini_enter_pin_code.json';
import type { DeusHardwareRoutesParams } from '@deushq/kit/src/routes/Root/Modal/HardwareDeus';
import { RootRoutes } from '@deushq/kit/src/routes/routesEnum';
import type { DeusHardwareModalRoutes } from '@deushq/kit/src/routes/routesEnum';
import type {
  ModalScreenProps,
  RootRoutesParams,
} from '@deushq/kit/src/routes/types';

import type { RouteProp } from '@react-navigation/core';

type NavigationProps = ModalScreenProps<RootRoutesParams>;
type RouteProps = RouteProp<
  DeusHardwareRoutesParams,
  DeusHardwareModalRoutes.DeusHardwarePinCodeModal
>;

const DeusHardwarePinCode: FC = () => {
  const intl = useIntl();
  const navigation = useNavigation<NavigationProps['navigation']>();
  const route = useRoute<RouteProps>();

  const [inputPin, setInputPin] = useState('');

  const { type } = route.params;

  const onKeyboardPress = (index: string) => {
    setInputPin(inputPin + index);
  };
  const onKeyboardDelPress = () => {
    if (inputPin.length > 0) setInputPin(inputPin.slice(0, -1));
  };
  const onKeyboardDonePress = () => {
    // deusBleConnect.sendResponse({
    //   type: 'ui-receive_pin',
    //   payload: inputPin,
    // });
  };

  const keyboard = (
    <>
      <Input type="password" w="100%" editable={false} value={inputPin} />
      <VStack space={2} mt={8}>
        <HStack space={2}>
          <Button flex={1} onPress={() => onKeyboardPress('7')}>
            *
          </Button>
          <Button flex={1} onPress={() => onKeyboardPress('8')}>
            *
          </Button>
          <Button flex={1} onPress={() => onKeyboardPress('9')}>
            *
          </Button>
        </HStack>
        <HStack space={2}>
          <Button flex={1} onPress={() => onKeyboardPress('4')}>
            *
          </Button>
          <Button flex={1} onPress={() => onKeyboardPress('5')}>
            *
          </Button>
          <Button flex={1} onPress={() => onKeyboardPress('6')}>
            *
          </Button>
        </HStack>
        <HStack space={2}>
          <Button flex={1} onPress={() => onKeyboardPress('1')}>
            *
          </Button>
          <Button flex={1} onPress={() => onKeyboardPress('2')}>
            *
          </Button>
          <Button flex={1} onPress={() => onKeyboardPress('3')}>
            *
          </Button>
        </HStack>
        <HStack space={2}>
          <Button flex={1} type="outline" onPress={() => onKeyboardDelPress()}>
            Del
          </Button>
          <Button flex={1} onPress={() => onKeyboardDonePress()}>
            OK
          </Button>
        </HStack>
      </VStack>
    </>
  );

  const content = (
    <>
      {(type === 'PinMatrixRequestType_NewSecond' ||
        type === 'PinMatrixRequestType_NewFirst' ||
        type === 'PinMatrixRequestType_Current') && (
        <Box mb={4}>{keyboard}</Box>
      )}
      {!type && (
        <Box flexDirection="column" alignItems="center" w="100%">
          <Box w="100%" h="220px">
            <LottieView source={DeusMiniEnterPin} autoPlay loop />
          </Box>

          <Typography.DisplayMedium>
            {intl.formatMessage({ id: 'modal__input_pin_code' })}
          </Typography.DisplayMedium>
        </Box>
      )}
    </>
  );

  const handleCloseSetup = () => {
    // Create wallet and account from device
    navigation.navigate(RootRoutes.Main);
  };

  return (
    <Modal
      footer={null}
      modalHeight="426px"
      onSecondaryActionPress={handleCloseSetup}
      staticChildrenProps={{
        flex: '1',
        p: 6,
        px: { base: 4, md: 6 },
      }}
    >
      {content}
    </Modal>
  );
};

export default DeusHardwarePinCode;
