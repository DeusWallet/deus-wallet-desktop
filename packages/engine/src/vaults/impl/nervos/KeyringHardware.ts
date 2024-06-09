import { blockchain } from '@ckb-lumos/base';
import {
  createTransactionFromSkeleton,
  sealTransaction,
} from '@ckb-lumos/helpers';
import { bytesToHex } from '@noble/hashes/utils';

import {
  DeusHardwareError,
  DeusInternalError,
} from '@deushq/engine/src/errors';
import { slicePathTemplate } from '@deushq/engine/src/managers/derivation';
import { getAccountNameInfoByImpl } from '@deushq/engine/src/managers/impl';
import { AccountType } from '@deushq/engine/src/types/account';
import type { DBSimpleAccount } from '@deushq/engine/src/types/account';
import type { SignedTx, UnsignedTx } from '@deushq/engine/src/types/provider';
import { KeyringHardwareBase } from '@deushq/engine/src/vaults/keyring/KeyringHardwareBase';
import type {
  IHardwareGetAddressParams,
  IPrepareHardwareAccountsParams,
} from '@deushq/engine/src/vaults/types';
import { addHexPrefix } from '@deushq/engine/src/vaults/utils/hexUtils';
import { convertDeviceError } from '@deushq/shared/src/device/deviceErrorUtils';
import {
  IMPL_NERVOS as COIN_IMPL,
  COINTYPE_NERVOS as COIN_TYPE,
} from '@deushq/shared/src/engine/engineConsts';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import { getConfig } from './utils/config';
import { serializeTransactionMessage } from './utils/transaction';

import type { TransactionSkeletonType } from '@ckb-lumos/helpers';

// @ts-ignore
export class KeyringHardware extends KeyringHardwareBase {
  async prepareAccounts(
    params: IPrepareHardwareAccountsParams,
  ): Promise<Array<DBSimpleAccount>> {
    const { indexes, names, template } = params;
    const { pathPrefix } = slicePathTemplate(template);
    const paths = indexes.map((index) => `${pathPrefix}/${index}`);
    const showOnDeus = false;
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();
    const config = getConfig(await this.getNetworkChainId());

    const { prefix } = getAccountNameInfoByImpl(COIN_IMPL).default;

    let addressesResponse;
    try {
      addressesResponse = await HardwareSDK.nervosGetAddress(
        connectId,
        deviceId,
        {
          bundle: paths.map((path) => ({
            path,
            showOnDeus,
            network: config.PREFIX,
          })),
          ...passphraseState,
        },
      );
    } catch (error: any) {
      debugLogger.common.error(error);
      throw new DeusHardwareError(error);
    }
    if (!addressesResponse.success) {
      debugLogger.common.error(addressesResponse.payload);
      throw convertDeviceError(addressesResponse.payload);
    }

    const ret: DBSimpleAccount[] = [];
    let index = 0;
    for (const addressInfo of addressesResponse.payload) {
      const { address, path } = addressInfo;
      const name = (names || [])[index] || `${prefix} #${indexes[index] + 1}`;
      ret.push({
        id: `${this.walletId}--${path}`,
        name,
        type: AccountType.SIMPLE,
        path,
        coinType: COIN_TYPE,
        pub: '',
        address,
      });
      index += 1;
    }
    return ret;
  }

  async getAddress(params: IHardwareGetAddressParams): Promise<string> {
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();

    const config = getConfig(await this.getNetworkChainId());

    const response = await HardwareSDK.nervosGetAddress(connectId, deviceId, {
      path: params.path,
      showOnDeus: params.showOnDeus,
      network: config.PREFIX,
      ...passphraseState,
    });
    if (response.success && !!response.payload?.address) {
      return response.payload?.address;
    }
    throw convertDeviceError(response.payload);
  }

  override async batchGetAddress(
    params: IHardwareGetAddressParams[],
  ): Promise<{ path: string; address: string }[]> {
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();

    const config = getConfig(await this.getNetworkChainId());

    const response = await HardwareSDK.nervosGetAddress(connectId, deviceId, {
      ...passphraseState,
      bundle: params.map(({ path, showOnDeus }) => ({
        path,
        showOnDeus: !!showOnDeus,
        network: config.PREFIX,
      })),
    });

    if (!response.success) {
      throw convertDeviceError(response.payload);
    }
    return response.payload.map((item) => ({
      path: item.path,
      address: item.address,
    }));
  }

  async signTransaction(unsignedTx: UnsignedTx): Promise<SignedTx> {
    debugLogger.common.info('signTransaction', unsignedTx);
    const dbAccount = await this.getDbAccount();

    const chainId = await this.getNetworkChainId();
    const config = getConfig(chainId);

    const { txSkeleton } = unsignedTx.payload as {
      txSkeleton: TransactionSkeletonType;
    };

    const { txSkeleton: txSkeletonWithMessage } =
      serializeTransactionMessage(txSkeleton);

    const witnessHex = txSkeleton.witnesses.get(0);
    if (!witnessHex) {
      throw new DeusInternalError('Transaction serialization failure');
    }

    const transaction = createTransactionFromSkeleton(txSkeleton);

    const serialize = blockchain.RawTransaction.pack(transaction);

    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();
    const HardwareSDK = await this.getHardwareSDKInstance();

    const response = await HardwareSDK.nervosSignTransaction(
      connectId,
      deviceId,
      {
        path: dbAccount.path,
        network: config.PREFIX,
        rawTx: bytesToHex(serialize),
        witnessHex,
        ...passphraseState,
      },
    );

    if (response.success) {
      const { signature } = response.payload;

      const tx = sealTransaction(txSkeletonWithMessage, [
        addHexPrefix(signature),
      ]);

      const rawTx = bytesToHex(blockchain.Transaction.pack(tx));

      return {
        txid: '',
        rawTx,
      };
    }

    throw convertDeviceError(response.payload);
  }
}
