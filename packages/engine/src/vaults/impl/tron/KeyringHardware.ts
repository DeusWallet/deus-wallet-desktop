/* eslint no-unused-vars: ["warn", { "argsIgnorePattern": "^_" }] */
/* eslint @typescript-eslint/no-unused-vars: ["warn", { "argsIgnorePattern": "^_" }] */
import TronWeb from 'tronweb';

import type { SignedTx, UnsignedTx } from '@deushq/engine/src/types/provider';
import { convertDeviceError } from '@deushq/shared/src/device/deviceErrorUtils';
import { COINTYPE_TRON as COIN_TYPE } from '@deushq/shared/src/engine/engineConsts';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import { NotImplemented, DeusHardwareError } from '../../../errors';
import { AccountType } from '../../../types/account';
import { KeyringHardwareBase } from '../../keyring/KeyringHardwareBase';

import type { DBSimpleAccount } from '../../../types/account';
import type {
  IGetAddressParams,
  IPrepareHardwareAccountsParams,
  ISignCredentialOptions,
} from '../../types';
import type { IEncodedTxTron } from './types';
import type { TronTransactionContract } from '@deusfe/hd-core';

const PATH_PREFIX = `m/44'/${COIN_TYPE}'/0'/0`;

export class KeyringHardware extends KeyringHardwareBase {
  override async signTransaction(
    unsignedTx: UnsignedTx,
    _options: ISignCredentialOptions,
  ): Promise<SignedTx> {
    const { encodedTx } = unsignedTx.payload as { encodedTx: IEncodedTxTron };
    const {
      ref_block_bytes: refBlockBytes,
      ref_block_hash: refBlockHash,
      expiration,
      timestamp,
      fee_limit: feeLimit,
    } = encodedTx.raw_data;

    let contractCall: TronTransactionContract | undefined;
    switch (encodedTx.raw_data.contract[0].type) {
      case 'TransferContract': {
        const { amount, to_address: toAddressHex } =
          encodedTx.raw_data.contract[0].parameter.value;
        contractCall = {
          transferContract: {
            amount,
            toAddress: TronWeb.address.fromHex(toAddressHex),
          },
        };
        break;
      }
      case 'TriggerSmartContract': {
        const {
          contract_address: contractAddressHex,
          call_value: callValue,
          data,
        } = encodedTx.raw_data.contract[0].parameter.value;
        contractCall = {
          triggerSmartContract: {
            contractAddress: TronWeb.address.fromHex(contractAddressHex),
            data,
            callValue,
          },
        };
        break;
      }
      case 'FreezeBalanceV2Contract': {
        const { frozen_balance: frozenBalance, resource = 'BANDWIDTH' } =
          encodedTx.raw_data.contract[0].parameter.value;
        contractCall = {
          freezeBalanceV2Contract: {
            frozenBalance,
            ...(resource === 'BANDWIDTH' ? null : { resource: 1 }),
          },
        };

        break;
      }
      case 'UnfreezeBalanceV2Contract': {
        const { unfreeze_balance: unfreezeBalance, resource = 'BANDWIDTH' } =
          encodedTx.raw_data.contract[0].parameter.value;
        contractCall = {
          unfreezeBalanceV2Contract: {
            unfreezeBalance,
            ...(resource === 'BANDWIDTH' ? null : { resource: 1 }),
          },
        };
        break;
      }

      case 'DelegateResourceContract': {
        const {
          receiver_address: receiverAddress,
          resource = 'BANDWIDTH',
          balance,
          lock,
        } = encodedTx.raw_data.contract[0].parameter.value;
        contractCall = {
          delegateResourceContract: {
            balance,
            receiverAddress: TronWeb.address.fromHex(receiverAddress),
            ...(lock ? { lock } : null),
            ...(resource === 'BANDWIDTH' ? null : { resource: 1 }),
          },
        };

        break;
      }
      case 'UnDelegateResourceContract': {
        const {
          receiver_address: receiverAddress,
          resource = 'BANDWIDTH',
          balance,
        } = encodedTx.raw_data.contract[0].parameter.value;
        contractCall = {
          unDelegateResourceContract: {
            balance,
            receiverAddress: TronWeb.address.fromHex(receiverAddress),
            ...(resource === 'BANDWIDTH' ? null : { resource: 1 }),
          },
        };
        break;
      }
      case 'WithdrawBalanceContract': {
        const { owner_address: ownerAddress } =
          encodedTx.raw_data.contract[0].parameter.value;
        contractCall = {
          withdrawBalanceContract: {
            ownerAddress: TronWeb.address.fromHex(ownerAddress),
          },
        };
        break;
      }
      case 'WithdrawExpireUnfreezeContract': {
        contractCall = {
          // @ts-ignore
          withdrawExpireUnfreezeContract: {},
        };
        break;
      }
      default:
    }

    if (typeof contractCall === 'undefined') {
      throw new NotImplemented();
    }

    const dbAccount = await this.getDbAccount();
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();
    const response = await HardwareSDK.tronSignTransaction(
      connectId,
      deviceId,
      {
        path: dbAccount.path,
        transaction: {
          refBlockBytes,
          refBlockHash,
          expiration,
          timestamp,
          feeLimit,
          contract: contractCall,
        },
        ...passphraseState,
      },
    );

    if (response.success && response.payload.signature) {
      const { signature, serialized_tx: serializedTx } = response.payload;
      return Promise.resolve({
        txid: encodedTx.txID,
        rawTx: JSON.stringify({
          ...encodedTx,
          raw_data_hex: serializedTx || encodedTx.raw_data_hex,
          signature: [signature],
        }),
      });
    }

    throw convertDeviceError(response.payload);
  }

  override signMessage(
    _messages: any[],
    _options: ISignCredentialOptions,
  ): any {
    throw new NotImplemented('Signing tron message is not supported yet.');
  }

  override async prepareAccounts(
    params: IPrepareHardwareAccountsParams,
  ): Promise<Array<DBSimpleAccount>> {
    const { indexes, names } = params;
    const paths = indexes.map((index) => `${PATH_PREFIX}/${index}`);
    const showOnDeus = false;
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();

    let addressesResponse;
    try {
      addressesResponse = await HardwareSDK.tronGetAddress(
        connectId,
        deviceId,
        {
          bundle: paths.map((path) => ({ path, showOnDeus })),
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

    return addressesResponse.payload
      .map(({ address, path }, index) => ({
        id: `${this.walletId}--${path}`,
        name: (names || [])[index] || `TRON #${indexes[index] + 1}`,
        type: AccountType.SIMPLE,
        path,
        coinType: COIN_TYPE,
        pub: '', // no public key info from hardware
        address: address ?? '',
      }))
      .filter(({ address }) => !!address);
  }

  override async getAddress(params: IGetAddressParams): Promise<string> {
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();
    const response = await HardwareSDK.tronGetAddress(connectId, deviceId, {
      path: params.path,
      showOnDeus: params.showOnDeus,
      ...passphraseState,
    });
    if (response.success && !!response.payload?.address) {
      return response.payload.address;
    }
    throw convertDeviceError(response.payload);
  }

  override async batchGetAddress(
    params: IGetAddressParams[],
  ): Promise<{ path: string; address: string }[]> {
    const HardwareSDK = await this.getHardwareSDKInstance();
    const { connectId, deviceId } = await this.getHardwareInfo();
    const passphraseState = await this.getWalletPassphraseState();
    const response = await HardwareSDK.tronGetAddress(connectId, deviceId, {
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
}
