import type { CoreApi } from '@deusfe/hd-core';

export const importHardwareSDK = async () =>
  (await import('@deusfe/hd-ble-sdk')).default as unknown as Promise<CoreApi>;

export const importHardwareSDKLowLevel = async () => Promise.resolve(undefined);
