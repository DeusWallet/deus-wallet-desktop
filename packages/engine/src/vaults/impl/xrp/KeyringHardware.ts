import { hashes } from 'xrpl';

import type { SignedTx, UnsignedTx } from '@deushq/engine/src/types/provider';
import { UnknownHardwareError } from '@deushq/kit/src/utils/hardware/errors';
import { convertDeviceError } from '@deushq/shared/src/device/deviceErrorUtils';
import { COINTYPE_XRP as COIN_TYPE } from '@deushq/shared/src/engine/engineConsts';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import { NotImplemented, DeusHardwareError } from '../../../errors';
import { AccountType } from '../../../types/account';
import { KeyringHardwareBase } from '../../keyring/KeyringHardwareBase';

import type { DBSimpleAccount } from '../../../types/account';
import type {
  IHardwareGetAddressParams,
  IPrepareHardwareAccountsParams,
} from '../../types';
import type { IEncodedTxXrp } from './types';

const PATH_PREFIX = `m/44'/${COIN_TYPE}'`;

export class KeyringHardware extends KeyringHardwareBase {
  override async prepareAccounts(
    params: IPrepareHardwareAccountsParams,
  ): Promise<DBSimpleAccount[]> {
    const { indexes, names } = params;
    const paths = indexes.map((index) => `${PATH_PREFIX}/${index}'/0/0`);
    const showOnDeus = false;
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();

    let response;
    try {
      response = await HardwareSDK.xrpGetAddress(connectId, deviceId, {
        bundle: paths.map((path) => ({ path, showOnDeus })),
        ...passphraseState,
      });
    } catch (error: any) {
      debugLogger.common.error(error);
      throw new DeusHardwareError(error);
    }

    if (!response.success) {
      debugLogger.common.error(response.payload);
      throw convertDeviceError(response.payload);
    }

    const ret = [];
    let index = 0;
    for (const addressInfo of response.payload) {
      const { address, path, publicKey } = addressInfo;
      if (address) {
        const name = (names || [])[index] || `RIPPLE #${indexes[index] + 1}`;
        ret.push({
          id: `${this.walletId}--${path}`,
          name,
          type: AccountType.SIMPLE,
          path,
          coinType: COIN_TYPE,
          pub: publicKey ?? '',
          address,
        });
        index += 1;
      }
    }
    return ret;
  }

  async getAddress(params: IHardwareGetAddressParams): Promise<string> {
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();
    const response = await HardwareSDK.xrpGetAddress(connectId, deviceId, {
      path: params.path,
      showOnDeus: params.showOnDeus,
      ...passphraseState,
    });
    if (response.success && !!response.payload?.address) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.payload.address;
    }
    throw convertDeviceError(response.payload);
  }

  override async batchGetAddress(
    params: IHardwareGetAddressParams[],
  ): Promise<{ path: string; address: string }[]> {
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();
    const response = await HardwareSDK.xrpGetAddress(connectId, deviceId, {
      ...passphraseState,
      bundle: params.map(({ path, showOnDeus }) => ({
        path,
        showOnDeus: !!showOnDeus,
      })),
    });

    if (!response.success) {
      throw convertDeviceError(response.payload);
    }
    return response.payload.map((item) => ({
      path: item.path ?? '',
      address: item.address ?? '',
    }));
  }

  override async signTransaction(unsignedTx: UnsignedTx): Promise<SignedTx> {
    debugLogger.common.info('signTransaction', unsignedTx);
    const { payload } = unsignedTx;
    const encodedTx = payload.encodedTx as IEncodedTxXrp;
    const dbAccount = await this.getDbAccount();
    const params = {
      path: dbAccount.path,
      transaction: {
        fee: encodedTx.Fee,
        flags: encodedTx.Flags,
        sequence: encodedTx.Sequence,
        maxLedgerVersion: encodedTx.LastLedgerSequence,
        payment: {
          amount: +encodedTx.Amount,
          destination: encodedTx.Destination,
          destinationTag: encodedTx.DestinationTag ?? undefined,
        },
      },
    };

    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();

    const HardwareSDK = await this.getHardwareSDKInstance();
    const response = await HardwareSDK.xrpSignTransaction(connectId, deviceId, {
      ...passphraseState,
      ...(params as unknown as any),
    });

    if (response.success) {
      const { serializedTx } = response.payload;
      if (!serializedTx) {
        throw new UnknownHardwareError();
      }
      return {
        txid: hashes.hashSignedTx(serializedTx),
        rawTx: serializedTx,
      };
    }

    throw convertDeviceError(response.payload);
  }

  signMessage(): Promise<string[]> {
    throw new NotImplemented();
  }
}
