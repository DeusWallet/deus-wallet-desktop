import { useIsVerticalLayout } from '@deushq/components';
import type { IDeusDeviceType } from '@deushq/shared/types';

import DeusDeviceWalletName from '../../../views/Hardware/Deus/DeusDeviceWalletName';
import DeusHardwareConfirm from '../../../views/Hardware/Deus/DeusHardwareConfirm';
import DeusHardwareConnect from '../../../views/Hardware/Deus/DeusHardwareConnect';
import DeusHardwareDetails from '../../../views/Hardware/Deus/DeusHardwareDetails';
import DeusHardwareDeviceName from '../../../views/Hardware/Deus/DeusHardwareDeviceName';
import DeusHardwareHomescreen from '../../../views/Hardware/Deus/DeusHardwareHomescreen';
import DeusHardwarePinCode from '../../../views/Hardware/Deus/DeusHardwarePinCode';
import DeusHardwareVerify from '../../../views/Hardware/Deus/DeusHardwareVerify';
import { DeusHardwareModalRoutes } from '../../routesEnum';

import { buildModalStackNavigatorOptions } from './buildModalStackNavigatorOptions';
import createStackNavigator from './createStackNavigator';

export type DeusHardwareRoutesParams = {
  [DeusHardwareModalRoutes.DeusHardwareDetailsModal]: {
    walletId: string;
  };
  [DeusHardwareModalRoutes.DeusHardwareVerifyModal]: {
    walletId: string;
  };
  [DeusHardwareModalRoutes.DeusHardwareConnectModal]: {
    deviceId?: string;
    connectId?: string;
    onHandler?: () => Promise<any>;
  };
  [DeusHardwareModalRoutes.DeusHardwarePinCodeModal]: {
    type: string | null | undefined;
  };
  [DeusHardwareModalRoutes.DeusHardwareConfirmModal]: {
    type: string | null | undefined;
  };
  [DeusHardwareModalRoutes.DeusHardwareDeviceNameModal]: {
    walletId: string;
    deviceName: string;
  };
  [DeusHardwareModalRoutes.DeusDeviceWalletNameModal]: {
    walletId: string;
  };
  [DeusHardwareModalRoutes.DeusHardwareHomeScreenModal]: {
    walletId: string;
    deviceType: IDeusDeviceType;
  };
};

const DeusHardwareNavigator =
  createStackNavigator<DeusHardwareRoutesParams>();

const modalRoutes = [
  {
    name: DeusHardwareModalRoutes.DeusHardwareDetailsModal,
    component: DeusHardwareDetails,
  },
  {
    name: DeusHardwareModalRoutes.DeusHardwareVerifyModal,
    component: DeusHardwareVerify,
  },
  {
    name: DeusHardwareModalRoutes.DeusHardwareConnectModal,
    component: DeusHardwareConnect,
  },
  {
    name: DeusHardwareModalRoutes.DeusHardwarePinCodeModal,
    component: DeusHardwarePinCode,
  },
  {
    name: DeusHardwareModalRoutes.DeusHardwareConfirmModal,
    component: DeusHardwareConfirm,
  },
  {
    name: DeusHardwareModalRoutes.DeusHardwareDeviceNameModal,
    component: DeusHardwareDeviceName,
  },
  {
    name: DeusHardwareModalRoutes.DeusHardwareHomeScreenModal,
    component: DeusHardwareHomescreen,
  },
  {
    name: DeusHardwareModalRoutes.DeusDeviceWalletNameModal,
    component: DeusDeviceWalletName,
  },
];

const DeusHardwareModalStack = () => {
  const isVerticalLayout = useIsVerticalLayout();
  return (
    <DeusHardwareNavigator.Navigator
      screenOptions={(navInfo) => ({
        headerShown: false,
        ...buildModalStackNavigatorOptions({ isVerticalLayout, navInfo }),
      })}
    >
      {modalRoutes.map((route) => (
        <DeusHardwareNavigator.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </DeusHardwareNavigator.Navigator>
  );
};

export default DeusHardwareModalStack;
