import { useIsVerticalLayout } from '@deushq/components';

import DeusLiteReset from '../../../views/Hardware/DeusLite/Reset';
import { DeusLiteResetModalRoutes } from '../../routesEnum';

import createStackNavigator from './createStackNavigator';

import type {
  DeusLiteModalRoutes,
  DeusLiteRoutesParams,
} from '../../../views/Hardware/DeusLite/routes';

export type DeusLiteResetRoutesParams = {
  [DeusLiteResetModalRoutes.DeusLiteResetModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteResetModal];
};

const DeusLiteResetNavigator =
  createStackNavigator<DeusLiteResetRoutesParams>();

const modalRoutes = [
  {
    name: DeusLiteResetModalRoutes.DeusLiteResetModal,
    component: DeusLiteReset,
  },
];

const DeusLiteResetModalStack = () => {
  const isVerticalLayout = useIsVerticalLayout();
  return (
    <DeusLiteResetNavigator.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: !!isVerticalLayout,
      }}
    >
      {modalRoutes.map((route) => (
        <DeusLiteResetNavigator.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </DeusLiteResetNavigator.Navigator>
  );
};

export default DeusLiteResetModalStack;
