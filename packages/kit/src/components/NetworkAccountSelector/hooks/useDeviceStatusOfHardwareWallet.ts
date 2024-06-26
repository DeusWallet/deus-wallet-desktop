import { useCallback, useEffect, useState } from 'react';

import type { Device } from '@deushq/engine/src/types/device';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { useAppSelector, useRuntimeWallets } from '../../../hooks/redux';

export type DeviceStatusType = {
  isConnected: boolean;
  hasUpgrade: boolean;
};
export type IHardwareDeviceStatusMap = {
  [deviceId: string]: DeviceStatusType | undefined;
};

export function useDeviceStatusOfHardwareWallet() {
  const { hardwareWallets } = useRuntimeWallets();
  const deviceUpdates = useAppSelector((s) => s.settings.deviceUpdates);
  const connected = useAppSelector((s) => s.hardware.connected);
  const [devicesStatus, setDevicesStatus] =
    useState<IHardwareDeviceStatusMap>();
  const getStatus = useCallback(
    (connectId: string | undefined): DeviceStatusType | undefined => {
      if (!connectId) return undefined;

      return {
        isConnected: connected.includes(connectId),
        hasUpgrade:
          !!deviceUpdates?.[connectId]?.ble ||
          !!deviceUpdates?.[connectId]?.firmware,
      };
    },
    [connected, deviceUpdates],
  );

  useEffect(() => {
    debugLogger.accountSelector.info(
      'useEffect hardwareWallets changed >>> useDeviceStatusOfHardwareWallet',
    );
    (async () => {
      const hwDeviceRec = (
        await backgroundApiProxy.engine.getHWDevices()
      ).reduce((acc, device) => {
        acc[device.id] = device;
        return acc;
      }, {} as Record<string, Device>);

      setDevicesStatus(
        hardwareWallets.reduce((acc, wallet) => {
          if (!wallet.associatedDevice) return acc;

          const device = hwDeviceRec[wallet.associatedDevice];
          if (device) {
            acc[wallet.associatedDevice] = getStatus(device.mac);
          }
          return acc;
        }, {} as IHardwareDeviceStatusMap),
      );
    })();
    // TODO watch walletSelector / accountSelector open
  }, [getStatus, hardwareWallets]);

  // for RightHeader
  // deviceStatus?.[activeSelectedWallet?.associatedDevice ?? ''] ??

  // for LeftSide
  // deviceStatus

  return {
    devicesStatus,
  };
}
