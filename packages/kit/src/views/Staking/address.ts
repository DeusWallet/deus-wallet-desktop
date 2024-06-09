import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

import {
  MainnetKeleContractAddress,
  MainnetLidoContractAddress,
  MainnetLidoWithdrawalERC721,
  MainnetMaticContractAddress,
  MainnetStMaticContractAddress,
  TestnetKeleContractAddress,
  TestnetLidoContractAddress,
  TestnetLidoWithdrawalERC721,
  TestnetMaticContractAddress,
  TestnetStMaticContractAddress,
} from './config';

export const getMaticContractAdderess = (networkId: string) => {
  if (networkId === DeusNetwork.eth) {
    return MainnetMaticContractAddress;
  }
  if (networkId === DeusNetwork.goerli) {
    return TestnetMaticContractAddress;
  }
  throw new Error('Not supported network');
};

export const getStMaticContractAdderess = (networkId: string) => {
  if (networkId === DeusNetwork.eth) {
    return MainnetStMaticContractAddress;
  }
  if (networkId === DeusNetwork.goerli) {
    return TestnetStMaticContractAddress;
  }
  throw new Error('Not supported network');
};

export const getLidoContractAddress = (networkId: string) => {
  if (networkId === DeusNetwork.eth) {
    return MainnetLidoContractAddress;
  }
  if (networkId === DeusNetwork.goerli) {
    return TestnetLidoContractAddress;
  }
  throw new Error('Not supported network');
};

export const getKeleContractAddress = (networkId: string): string => {
  if (networkId === DeusNetwork.eth) {
    return MainnetKeleContractAddress;
  }
  if (networkId === DeusNetwork.goerli) {
    return TestnetKeleContractAddress;
  }
  throw new Error('Not supported network');
};

export const getLidoNFTContractAddress = (networkId: string) => {
  if (networkId === DeusNetwork.eth) {
    return MainnetLidoWithdrawalERC721;
  }
  if (networkId === DeusNetwork.goerli) {
    return TestnetLidoWithdrawalERC721;
  }
  throw new Error('Not supported network');
};
