import type { CoreApi, LowLevelCoreApi } from '@deusfe/hd-core';

export const importHardwareSDK = async () => {
  const sdkLib = await import('@deusfe/hd-web-sdk');
  const sdk =
    // @ts-ignore
    (sdkLib.HardwareSDKTopLevel as CoreApi) ||
    sdkLib.default.HardwareSDKTopLevel;
  return sdk;
};

export const importHardwareSDKLowLevel = async () =>
  (await import('@deushq/kit-bg/src/offscreens/instance/offscreenApiProxy'))
    .default.hardwareSDKLowLevel as unknown as Promise<LowLevelCoreApi>;
