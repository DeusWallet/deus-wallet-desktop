import type {
  IInjectedProviderNamesStrings,
  IJsonRpcRequest,
} from '@deusfe/cross-inpage-provider-types';
import type { Features, IDeviceType } from '@deusfe/hd-core';

export type IDeusDeviceType = IDeviceType;

export type IDeusDeviceFeatures = Features;

export type IDappSourceInfo = {
  id: string | number; // ServicePromise callback id to reject/resolve
  origin: string;
  hostname: string;
  scope: IInjectedProviderNamesStrings;
  data: IJsonRpcRequest;
};

export enum ENetworkStatus {
  TRASH = 'TRASH',
  LISTED = 'LISTED',
}

export interface INetworkFeeInfo {
  code: string;
  symbol: string;
  decimals: number;
}

export interface INetworkRpcURL {
  url: string;
  indexer?: string;
}

export interface INetworkPriceConfig {
  channel: string;
  native?: string;
  platform?: string;
}

export interface INetworkExplorerConfig {
  name?: string;
  address?: string;
  transaction?: string;
  block?: string;
}

export type IServerNetwork = {
  id: string;
  impl: string;
  chainId: string;
  name: string;
  code: string;
  shortname: string;
  shortcode: string;
  symbol: string;
  logoURI: string;
  decimals: number;
  feeMeta: INetworkFeeInfo;
  defaultEnabled: boolean;
  support: string[];
  balance2FeeDecimals: number;
  status: ENetworkStatus;
  clientApi?: Record<string, string>;
  isTestnet: boolean;
  rpcURLs: INetworkRpcURL[];
  priceConfigs: INetworkPriceConfig[];
  explorers: INetworkExplorerConfig[];
  extensions: Record<string, unknown>;
};

export enum EDeusDomain {
  DEUS_SO = 'deus.so',
  DEUS_CN = 'deuscn.com',
}
