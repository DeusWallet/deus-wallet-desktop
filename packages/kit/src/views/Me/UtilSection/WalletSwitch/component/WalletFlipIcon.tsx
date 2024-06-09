import type { FC } from 'react';

import { Box, Image } from '@deushq/components';
import deusLogoDisable from '@deushq/kit/assets/walletLogo/deus_logo_sm_disable.png';
import deusLogoEnable from '@deushq/kit/assets/walletLogo/deus_logo_sm_enable.png';

import type { ImageSourcePropType } from 'react-native';

type WalletFlipIconProps = {
  baseLogoImage: ImageSourcePropType;
  enable: boolean;
};

export const WalletFlipIcon: FC<WalletFlipIconProps> = ({
  baseLogoImage,
  enable,
}) => (
  <Box w="40px" h="40px" justifyContent="center" alignItems="center">
    <Image source={baseLogoImage} size={8} />
    <Box position="absolute" right="0" bottom="0">
      <Image src={enable ? deusLogoEnable : deusLogoDisable} size={4} />
    </Box>
  </Box>
);
