import type { FC } from 'react';

import { HStack, Text, Token } from '@deushq/components';
import type { Network } from '@deushq/engine/src/types/network';
import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

const HeaderDescription: FC<{ network?: Network | null }> = ({ network }) => {
  if (!network) return null;

  return (
    <HStack space="6px">
      <Token
        size={4}
        token={{
          logoURI: network.logoURI,
        }}
      />
      <Text typography="Caption" color="text-subdued">{`Bitcoin${
        network.id === DeusNetwork.tbtc ? ' Testnet' : ''
      }`}</Text>
    </HStack>
  );
};

export default HeaderDescription;
