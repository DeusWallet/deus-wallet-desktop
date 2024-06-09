import type { Networks } from '@deushq/engine/src/vaults/impl/btc/inscribe/types';
import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

import { SimpleDbEntityBase } from './SimpleDbEntityBase';

import type { IInscriptionHistory } from '../../../vaults/impl/btc/inscribe/types';

export type ISimpleDbEntityInscribeData = {
  orderListsMainNet?: IInscriptionHistory[];
  orderListsTestNet?: IInscriptionHistory[];
};

export class SimpleDbEntityInscribe extends SimpleDbEntityBase<ISimpleDbEntityInscribeData> {
  entityName = 'Inscribe';

  override enableCache = false;

  async savaItem(data: IInscriptionHistory, network: Networks): Promise<void> {
    const rawData = await this.getRawData();
    if (network === 'main') {
      const orderListsMainNet = rawData?.orderListsMainNet ?? [];
      this.setRawData({
        ...rawData,
        orderListsMainNet: [data].concat(orderListsMainNet).slice(0, 50),
      });
    }
    if (network === 'testnet') {
      const orderListsTestNet = rawData?.orderListsTestNet ?? [];
      this.setRawData({
        ...rawData,
        orderListsTestNet: [data].concat(orderListsTestNet).slice(0, 50),
      });
    }
  }

  async getItems(networkId: string): Promise<IInscriptionHistory[]> {
    const rawData = await this.getRawData();
    if (networkId === DeusNetwork.btc) {
      return rawData?.orderListsMainNet ?? [];
    }
    if (networkId === DeusNetwork.tbtc) {
      return rawData?.orderListsTestNet ?? [];
    }
    return [];
  }
}
