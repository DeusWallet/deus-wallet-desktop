import { useIsVerticalLayout } from '@deushq/components';

import DeusLiteChangePin from '../../../views/Hardware/DeusLite/ChangePin';
import {
  DeusLiteCurrentPinCode,
  DeusLiteNewRepeatPinCode,
  DeusLiteNewSetPinCode,
} from '../../../views/Hardware/DeusLite/ChangePinInputPin';
import { DeusLiteChangePinModalRoutes } from '../../routesEnum';

import createStackNavigator from './createStackNavigator';

import type {
  DeusLiteModalRoutes,
  DeusLiteRoutesParams,
} from '../../../views/Hardware/DeusLite/routes';

export type DeusLiteChangePinRoutesParams = {
  [DeusLiteChangePinModalRoutes.DeusLiteChangePinInputPinModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteChangePinInputPinModal];
  [DeusLiteChangePinModalRoutes.DeusLiteChangePinSetModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteChangePinSetModal];
  [DeusLiteChangePinModalRoutes.DeusLiteChangePinRepeatModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteChangePinRepeatModal];
  [DeusLiteChangePinModalRoutes.DeusLiteChangePinModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteChangePinModal];
};

const DeusLitePinNavigator =
  createStackNavigator<DeusLiteChangePinRoutesParams>();

const modalRoutes = [
  {
    name: DeusLiteChangePinModalRoutes.DeusLiteChangePinInputPinModal,
    component: DeusLiteCurrentPinCode,
  },
  {
    name: DeusLiteChangePinModalRoutes.DeusLiteChangePinSetModal,
    component: DeusLiteNewSetPinCode,
  },
  {
    name: DeusLiteChangePinModalRoutes.DeusLiteChangePinRepeatModal,
    component: DeusLiteNewRepeatPinCode,
  },
  {
    name: DeusLiteChangePinModalRoutes.DeusLiteChangePinModal,
    component: DeusLiteChangePin,
  },
];

const DeusLitePinModalStack = () => {
  const isVerticalLayout = useIsVerticalLayout();
  return (
    <DeusLitePinNavigator.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: !!isVerticalLayout,
      }}
    >
      {modalRoutes.map((route) => (
        <DeusLitePinNavigator.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </DeusLitePinNavigator.Navigator>
  );
};

export default DeusLitePinModalStack;
