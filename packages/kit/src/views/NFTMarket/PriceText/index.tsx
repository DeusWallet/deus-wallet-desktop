import type { ComponentProps, FC } from 'react';

import { Text } from '@deushq/components';
import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

export const floorPriceSymbolMap: Record<string, string> = {
  [DeusNetwork.eth]: 'ETH',
  [DeusNetwork.optimism]: 'ETH',
  [DeusNetwork.bsc]: 'BNB',
  [DeusNetwork.polygon]: 'MATIC',
  [DeusNetwork.arbitrum]: 'ETH',
  [DeusNetwork.sol]: 'SOL',
  [DeusNetwork.avalanche]: 'AVAX',
};
type Props = {
  prefix?: string;
  price?: number | string | null;
  symbol?: string;
  networkId?: string;
} & ComponentProps<typeof Text>;

export function PriceString({ prefix, price, networkId, symbol }: Props) {
  const innderSymbol = symbol ?? floorPriceSymbolMap[networkId ?? ''];
  let value = '–';
  if (price && price !== null) {
    value = `${price} ${innderSymbol ?? ''}`;
  }
  if (prefix) {
    return `${prefix} ${value}`;
  }
  return `${value}`;
}

const PriceText: FC<Props> = ({
  prefix = '',
  price,
  networkId,
  symbol,
  ...textProps
}) => (
  <Text {...textProps}>
    {PriceString({ prefix, price, networkId, symbol })}
  </Text>
);

export default PriceText;
