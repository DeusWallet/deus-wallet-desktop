import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { Box, Switch, Typography } from '@deushq/components';

import backgroundApiProxy from '../../../../../background/instance/backgroundApiProxy';
import { useWalletSwitchConfig } from '../hooks/useWalletSwitch';

import { WalletFlipIcon } from './WalletFlipIcon';

type TWalletSwitchCellProps = {
  walletId: string;
  toggleWalletSwitch: (walletId: string, enable: boolean) => void;
};

export const WalletSwitchCell: FC<TWalletSwitchCellProps> = ({
  toggleWalletSwitch,
  walletId,
}) => {
  const config = useWalletSwitchConfig({ walletId });
  const [switchEnable, setSwitchEnable] = useState(!!config?.enable);

  useEffect(() => {
    setSwitchEnable((prevStatus) => {
      if (prevStatus !== !!config?.enable) {
        return !!config?.enable;
      }
      return prevStatus;
    });
  }, [config?.enable, walletId]);

  const handleToggle = useCallback(() => {
    setSwitchEnable((prevStatus) => {
      const newEnableStatus = !prevStatus;
      setTimeout(() => {
        backgroundApiProxy.serviceSetting.toggleWalletSwitchConfig(
          walletId,
          newEnableStatus,
        );
        toggleWalletSwitch(walletId, newEnableStatus);
      }, 100);
      return newEnableStatus;
    });
  }, [toggleWalletSwitch, walletId]);

  return config ? (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      py={2}
    >
      <Box flexDirection="row" alignItems="center">
        <WalletFlipIcon baseLogoImage={config.logo} enable={switchEnable} />
        <Typography.Body1Strong ml={2}>{config.title}</Typography.Body1Strong>
      </Box>
      <Box>
        <Switch
          mr={1}
          labelType="false"
          isChecked={switchEnable}
          onToggle={handleToggle}
        />
      </Box>
    </Box>
  ) : null;
};
