import { createRef, memo, useEffect, useMemo, useRef } from 'react';

// import { useFlipper } from '@react-navigation/devtools';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { FullWindowOverlay } from 'react-native-screens';

import {
  ToastManager,
  useIsVerticalLayout,
  useThemeValue,
} from '@deushq/components';
import CustomToast from '@deushq/components/src/Toast/Custom';
import { useAppSelector } from '@deushq/kit/src/hooks/redux';
import { RootStackNavigator } from '@deushq/kit/src/routes';
import type { RootRoutesParams } from '@deushq/kit/src/routes/types';
import { analyticLogEvent } from '@deushq/shared/src/analytics';
import { setAttributes } from '@deushq/shared/src/crashlytics';
import debugLogger from '@deushq/shared/src/logger/debugLogger';
import platformEnv from '@deushq/shared/src/platformEnv';

import { useShortcuts } from '../hooks/useShortcuts';
import '../routes/deepLink';
import buildLinking from '../routes/linking';
import { createLazyComponent } from '../utils/createLazyComponent';
import { FULLWINDOW_OVERLAY_PORTAL } from '../utils/overlayUtils';
import { PortalContainer } from '../views/Overlay/RootPortal';

import RedirectProvider from './RedirectProvider';

import type { NavigationContainerRef } from '@react-navigation/native';

import { markFPTime } from '@deushq/shared/src/modules3rdParty/react-native-metrix';

export type RootNavContainerRef = NavigationContainerRef<RootRoutesParams>;
export const navigationRef = createRef<RootNavContainerRef>();

const ChainWebEmbed = createLazyComponent(
  () => import('@deushq/kit/src/views/ChainWebEmbed'),
);

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var $navigationRef: typeof navigationRef;
}

// update navigationRef.current at <NavigationContainer />
global.$navigationRef = navigationRef;

const NavigationApp = () => {
  const routeNameRef = useRef<string>();
  const isVerticalLayout = useIsVerticalLayout();
  const [bgColor, textColor, dividerColor] = useThemeValue([
    'background-default',
    'text-default',
    'divider',
  ]);

  const linking = useMemo(() => buildLinking(), []);

  const backgroundShowToastOptions = useAppSelector(
    (s) => s.refresher.backgroundShowToastOptions,
  );
  const backgroundShowToastTs = useAppSelector(
    (s) => s.refresher.backgroundShowToastTs,
  );

  useEffect(() => {
    if (!backgroundShowToastOptions.title) {
      return;
    }
    ToastManager.show(
      {
        title: backgroundShowToastOptions.title,
      },
      {
        type: backgroundShowToastOptions.type,
      },
    );
  }, [backgroundShowToastTs, backgroundShowToastOptions]);

  /**
   * native-android & vertical layout web or ext
   */
  const showFixedBg =
    platformEnv.isNativeAndroid ||
    (isVerticalLayout && (platformEnv.isWeb || platformEnv.isExtension));

  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: showFixedBg ? bgColor : 'transparent',
        card: bgColor,
        text: textColor,
        border: dividerColor,
      },
    }),
    [bgColor, textColor, dividerColor, showFixedBg],
  );

  const instanceId = useAppSelector((s) => s.settings.instanceId);

  useEffect(() => {
    analyticLogEvent('initialized', {
      instanceId,
      platform: platformEnv.symbol,
      distribution: platformEnv.distributionChannel,
    });
    markFPTime();
    setAttributes({
      instanceId,
      platform: platformEnv.symbol ?? '',
      distribution: platformEnv.distributionChannel ?? '',
    });
  }, [instanceId]);

  global.$$deusPerfTrace?.log({
    name: 'NavigationProvider/NavigationApp render',
    payload: {
      instanceId,
      isVerticalLayout,
      bgColor,
      textColor,
      dividerColor,
    },
  });

  // https://reactnavigation.org/docs/devtools/#useflipper
  // only work during development and are disabled in production.
  // useFlipper(navigationRef);

  useShortcuts();

  const globalPortalViews = useMemo(
    () => (
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <ChainWebEmbed />
        <PortalContainer name={FULLWINDOW_OVERLAY_PORTAL} />
        <CustomToast bottomOffset={60} />
      </View>
    ),
    [],
  );

  return (
    <NavigationContainer
      documentTitle={{
        formatter: () => 'Deus',
      }}
      onReady={() => {
        routeNameRef.current =
          navigationRef?.current?.getCurrentRoute?.()?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute?.()?.name;

        setAttributes({
          previousRouteName: previousRouteName ?? '',
          currentRouteName: currentRouteName ?? '',
        });
        if (previousRouteName !== currentRouteName) {
          debugLogger.navigation.info(
            previousRouteName,
            ' -> ',
            currentRouteName,
          );
        }

        routeNameRef.current = currentRouteName;
      }}
      ref={navigationRef}
      theme={navigationTheme}
      linking={linking}
    >
      <RootSiblingParent>
        <RedirectProvider>
          <RootStackNavigator />
        </RedirectProvider>
        {platformEnv.isNativeIOS ? (
          // FullWindowOverlay can render above native views
          // but can not work with modal
          // https://github.com/software-mansion/react-native-screens/issues/1149
          // so now only used for toast
          <FullWindowOverlay>{globalPortalViews}</FullWindowOverlay>
        ) : (
          globalPortalViews
        )}
      </RootSiblingParent>
    </NavigationContainer>
  );
};

NavigationApp.displayName = 'NavigationApp';

export default memo(NavigationApp);
