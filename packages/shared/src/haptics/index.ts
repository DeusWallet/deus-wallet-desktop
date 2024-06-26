import { selectionAsync } from 'expo-haptics';

import platformEnv from '../platformEnv';

/** only support on iphone or android(tablet), not include ipad */
export const supportedHaptics =
  platformEnv.isNativeIOSPhone || platformEnv.isNativeAndroid;

/** native ios default is true, native android default is false */
export const defaultHapticStatus = !!(
  platformEnv.isNativeIOSPhone && supportedHaptics
);

export const doHapticsWhenEnabled = supportedHaptics
  ? () => {
      const { appSelector } =
        require('@deushq/kit/src/store') as typeof import('@deushq/kit/src/store');
      if (appSelector((s) => s.settings.enableHaptics) ?? defaultHapticStatus) {
        selectionAsync();
      }
    }
  : () => {};
