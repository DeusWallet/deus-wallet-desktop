import axios from 'axios';
import BigNumber from 'bignumber.js';

import { DeusNetwork } from '@deushq/shared/src/config/networkIds';
import { SEPERATOR } from '@deushq/shared/src/engine/engineConsts';

import { NotImplemented, DeusInternalError } from '../errors';

import type {
  BlockNativeGasAPIResponse,
  BlockNativeGasInfo,
} from '../types/blockNative';

const BLOCK_NATIVE_BASE_URL = 'https://api.blocknative.com';
const SUPPORTED_CHAIN: string[] = [DeusNetwork.eth, DeusNetwork.polygon];

const getBlockNativeGasInfo = async ({
  networkId,
  priceOrder,
}: {
  networkId: string;
  priceOrder?: 'desc';
}): Promise<BlockNativeGasInfo> => {
  if (!SUPPORTED_CHAIN.includes(networkId)) {
    throw new NotImplemented('block native does not supported this network');
  }

  const [, chainId] = networkId.split(SEPERATOR);
  const resp = (
    await axios.get<BlockNativeGasAPIResponse>(
      `${BLOCK_NATIVE_BASE_URL}/gasprices/blockprices`,
      {
        params: { chainid: chainId },
      },
    )
  ).data;

  if (resp.blockPrices && resp.blockPrices.length > 0) {
    const blockPrices = resp.blockPrices[0];
    const { estimatedPrices, estimatedTransactionCount, baseFeePerGas } =
      blockPrices;

    const prices = [];

    for (const price of estimatedPrices) {
      if (price.maxFeePerGas && price.maxPriorityFeePerGas) {
        prices.push({
          baseFee: new BigNumber(baseFeePerGas).toFixed(),
          confidence: price.confidence,
          maxFeePerGas: new BigNumber(price.maxFeePerGas).toFixed(),
          maxPriorityFeePerGas: new BigNumber(
            price.maxPriorityFeePerGas,
          ).toFixed(),
          price: new BigNumber(price.price).toFixed(),
        });
      }
    }

    return {
      estimatedTransactionCount,
      baseFee: new BigNumber(baseFeePerGas).toFixed(),
      maxPrice: resp.maxPrice,
      unit: resp.unit,
      prices:
        priceOrder === 'desc'
          ? prices
          : prices.sort((a, b) => (a.confidence > b.confidence ? 1 : -1)),
    };
  }

  throw new DeusInternalError('block native bad response');
};

export { getBlockNativeGasInfo };
