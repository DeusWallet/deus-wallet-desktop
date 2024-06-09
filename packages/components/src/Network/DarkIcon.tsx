import type { FC } from 'react';

import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

import Icon from '../Icon';
import { TokenIcon } from '../Token';

import type { ICON_NAMES } from '../Icon';

export const NetworkDarkIconNameMap: Record<string, ICON_NAMES> = {
  [DeusNetwork.ada]: 'CardanoIllus',
  [DeusNetwork.algo]: 'AlgorandIllus',
  [DeusNetwork.apt]: 'AptosIllus',
  [DeusNetwork.bch]: 'BitcoinCashIllus',
  [DeusNetwork.btc]: 'BitcoinIllus',
  [DeusNetwork.cfx]: 'ConfluxEspaceIllus',
  [DeusNetwork.akash]: 'AkashIllus',
  [DeusNetwork.cosmoshub]: 'CosmosIllus',
  [DeusNetwork.cryptoorgchain]: 'CryptoOrgIllus',
  [DeusNetwork.fetch]: 'FetchAiIllus',
  [DeusNetwork.juno]: 'JunoIllus',
  [DeusNetwork.osmosis]: 'OsmosisIllus',
  [DeusNetwork.terra]: 'TerraIllus',
  [DeusNetwork.secretnetwork]: 'SecretNetworkIllus',
  [DeusNetwork.doge]: 'DogecoinIllus',
  [DeusNetwork.astar]: 'AstarIllus',
  [DeusNetwork.ksm]: 'KusamaIllus',
  [DeusNetwork.dot]: 'PolkadotIllus',
  [DeusNetwork.eth]: 'EthereumIllus',
  [DeusNetwork.optimism]: 'OptimismIllus',
  [DeusNetwork.xdai]: 'GnosisChainIllus',
  [DeusNetwork.ethw]: 'EthereumpowIllus',
  [DeusNetwork.cfxespace]: 'ConfluxEspaceIllus',
  [DeusNetwork.heco]: 'HuobiEcoChainIllus',
  [DeusNetwork.aurora]: 'AuroraIllus',
  [DeusNetwork.polygon]: 'PolygonIllus',
  [DeusNetwork.cronos]: 'CronosIllus',
  [DeusNetwork.fantom]: 'FantomIllus',
  [DeusNetwork.boba]: 'BobaNetworkIllus',
  [DeusNetwork.fevm]: 'FilecoinIllus',
  [DeusNetwork.zksyncera]: 'ZksyncEraMainnetIllus',
  [DeusNetwork.arbitrum]: 'ArbitrumIllus',
  [DeusNetwork.celo]: 'CeloIllus',
  [DeusNetwork.avalanche]: 'AvalancheIllus',
  [DeusNetwork.etf]: 'EthereumFairIllus',
  [DeusNetwork.bsc]: 'BnbSmartChainIllus',
  [DeusNetwork.etc]: 'EthereumClassicIllus',
  [DeusNetwork.okt]: 'OkxChainIllus',
  [DeusNetwork.mvm]: 'MixinVirtualMachineIllus',
  [DeusNetwork.fil]: 'FilecoinIllus',
  [DeusNetwork.kaspa]: 'KaspaIllus',
  [DeusNetwork.ltc]: 'LitecoinIllus',
  [DeusNetwork.near]: 'NearIllus',
  [DeusNetwork.sol]: 'SolanaIllus',
  [DeusNetwork.stc]: 'StarcoinIllus',
  [DeusNetwork.sui]: 'SuiIllus',
  [DeusNetwork.trx]: 'TronIllus',
  [DeusNetwork.xmr]: 'MoneroIllus',
  [DeusNetwork.xrp]: 'RippleIllus',
  [DeusNetwork.lightning]: 'LightningNetworkIllus',
  [DeusNetwork.nexa]: 'NexaIllus',
  [DeusNetwork.base]: 'BaseIllus',
  [DeusNetwork.linea]: 'LineaIllus',
  [DeusNetwork.mantle]: 'MantleIllus',
  [DeusNetwork.scroll]: 'ScrollIllus',
  more: 'MoreIllus',
};

export const NetworkDarkIcon: FC<{
  networkId: string;
  fallback?: string;
  size?: number;
}> = ({ networkId, fallback, size = 4 }) => {
  const iconName = NetworkDarkIconNameMap[networkId];
  if (iconName) {
    return <Icon size={4 * size} name={iconName} color="icon-subdued" />;
  }
  return (
    <TokenIcon
      size={size}
      token={{
        name: fallback,
      }}
    />
  );
};
