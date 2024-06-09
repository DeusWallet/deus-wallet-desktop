import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

export const supportedNetworks = [
  DeusNetwork.btc,
  DeusNetwork.eth,
  DeusNetwork.polygon,
];

export const priceUnit = {
  [DeusNetwork.btc]: 'sat/vB',
  [DeusNetwork.eth]: 'Gwei',
  [DeusNetwork.polygon]: 'Gwei',
};

export const supportedNetworksSettings = {
  [DeusNetwork.btc]: {
    supportOverview: false,
    EIP1559Enabled: false,
  },
  [DeusNetwork.eth]: {
    supportOverview: true,
    EIP1559Enabled: true,
  },
  [DeusNetwork.polygon]: {
    supportOverview: true,
    EIP1559Enabled: true,
  },
};

export const networkPendingTransactionThresholds = {
  [DeusNetwork.eth]: {
    'low': 0,
    'stable': 100,
    'busy': 200,
  },
  [DeusNetwork.polygon]: {
    'low': 0,
    'stable': 200,
    'busy': 300,
  },
};

export const btcMockLimit = '340';
