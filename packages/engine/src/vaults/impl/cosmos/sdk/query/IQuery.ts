import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

import { CosmwasmQuery } from './CosmwasmQuery';
import { DeusQuery } from './DeusQuery';
import { SecretwasmQuery } from './SecretwasmQuery';

import type { AxiosInstance } from 'axios';
import type BigNumber from 'bignumber.js';

export interface Cw20AssetInfo {
  contractAddress: string;
  name: string;
  decimals: number;
  symbol: string;
}

export interface Cw20TokenBalance {
  address: string;
  balance: BigNumber;
}

export interface QueryChainInfo {
  networkId: string;
  axios?: AxiosInstance;
}

export interface IQuery {
  queryCw20TokenInfo: (
    chainInfo: QueryChainInfo,
    contractAddressArray: string[],
  ) => Promise<Cw20AssetInfo[]>;

  queryCw20TokenBalance: (
    chainInfo: QueryChainInfo,
    contractAddress: string,
    address: string[],
  ) => Promise<Cw20TokenBalance[]>;
}

class QueryRegistry {
  private readonly registryMap: Map<string, IQuery> = new Map();

  public get(chainId: string): IQuery | undefined {
    return this.registryMap.get(chainId);
  }

  public register(chainId: string, query: IQuery): void {
    this.registryMap.set(chainId, query);
  }
}

export const queryRegistry = new QueryRegistry();
const cosmwasmQuery = new CosmwasmQuery();
queryRegistry.register(DeusNetwork.juno, cosmwasmQuery);
// queryRegistry.register(DeusNetwork.terra, cosmwasmQuery); // terra2
queryRegistry.register(DeusNetwork.osmosis, cosmwasmQuery);
queryRegistry.register(DeusNetwork.secretnetwork, new SecretwasmQuery());

const oneKeyQuery = new DeusQuery();
queryRegistry.register(DeusNetwork.cosmoshub, oneKeyQuery);
queryRegistry.register(DeusNetwork.akash, oneKeyQuery);
queryRegistry.register(DeusNetwork.fetch, oneKeyQuery);
