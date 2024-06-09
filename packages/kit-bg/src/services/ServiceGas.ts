import BigNumber from 'bignumber.js';

import type {
  IEncodedTx,
  IFeeInfoUnit,
} from '@deushq/engine/src/vaults/types';
import { setNetworkPrice } from '@deushq/kit/src/store/reducers/discover';
import {
  backgroundClass,
  backgroundMethod,
} from '@deushq/shared/src/background/backgroundDecorators';
import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

import ServiceBase from './ServiceBase';

@backgroundClass()
class ServiceGas extends ServiceBase {
  private isRefresh: Record<string, boolean> = {};

  @backgroundMethod()
  async getGasInfo({ networkId }: { networkId: string }) {
    const { engine } = this.backgroundApi;
    return engine.getGasInfo(networkId);
  }

  @backgroundMethod()
  async getTxWaitingSeconds({ networkId }: { networkId: string }) {
    const { engine } = this.backgroundApi;
    const vault = await engine.getChainOnlyVault(networkId);
    return vault.getTxWaitingSeconds();
  }

  @backgroundMethod()
  async refreshGasPrice({ networkId }: { networkId: string }) {
    if (this.isRefresh[networkId]) {
      return;
    }
    const { engine, dispatch } = this.backgroundApi;
    this.isRefresh[networkId] = true;
    try {
      const res = await this.getGasInfo({
        networkId,
      });
      const item = res.prices[0];
      let value = '';
      if (typeof item === 'string') {
        value = item;
      } else {
        value = item.price || Number(item.baseFee).toFixed(0) || '';
      }
      if (networkId === DeusNetwork.btc) {
        const network = await engine.getNetwork(networkId);
        value = `${new BigNumber(value)
          .shiftedBy(network?.feeDecimals ?? 8)
          .toFixed()}`;
      }
      dispatch(setNetworkPrice({ networkId, price: value }));
    } finally {
      this.isRefresh[networkId] = false;
    }
  }

  @backgroundMethod()
  async attachFeeInfoToDAppEncodedTx(params: {
    networkId: string;
    accountId: string;
    encodedTx: IEncodedTx;
    feeInfoValue: IFeeInfoUnit;
  }): Promise<IEncodedTx> {
    const { networkId, accountId } = params;
    const { engine } = this.backgroundApi;
    const vault = await engine.getVault({ networkId, accountId });
    const txWithFee: IEncodedTx = await vault.attachFeeInfoToDAppEncodedTx(
      params,
    );
    return txWithFee;
  }
}

export default ServiceGas;
