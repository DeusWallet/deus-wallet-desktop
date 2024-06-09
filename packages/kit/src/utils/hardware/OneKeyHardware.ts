import { getDeviceTypeByDeviceId as getDeviceTypeByDeviceIdUtil } from '@deusfe/hd-core';

import type { IDeusDeviceFeatures } from '@deushq/shared/types';

import type { IDeviceType, IVersionArray } from '@deusfe/hd-core';

export const getDeviceTypeByDeviceId = (deviceId?: string): IDeviceType =>
  getDeviceTypeByDeviceIdUtil(deviceId);

export const isHwClassic = (deviceType: string | undefined): boolean =>
  deviceType === 'classic';

export const getDeviceFirmwareVersion = (
  features: IDeusDeviceFeatures | undefined,
): IVersionArray => {
  if (!features) return [0, 0, 0];

  if (features.deus_version) {
    return features.deus_version.split('.') as unknown as IVersionArray;
  }
  return [
    features.major_version,
    features.minor_version,
    features.patch_version,
  ];
};
