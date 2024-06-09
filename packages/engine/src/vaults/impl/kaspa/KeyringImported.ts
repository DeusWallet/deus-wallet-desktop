import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

import { DeusInternalError } from '@deushq/engine/src/errors';
import { Signer } from '@deushq/engine/src/proxy';
import { secp256k1 } from '@deushq/engine/src/secret/curves';
import { AccountType } from '@deushq/engine/src/types/account';
import type { DBSimpleAccount } from '@deushq/engine/src/types/account';
import type { UnsignedTx } from '@deushq/engine/src/types/provider';
import { KeyringImportedBase } from '@deushq/engine/src/vaults/keyring/KeyringImportedBase';
import type {
  IPrepareImportedAccountsParams,
  ISignCredentialOptions,
  SignedTxResult,
} from '@deushq/engine/src/vaults/types';
import { COINTYPE_KASPA as COIN_TYPE } from '@deushq/shared/src/engine/engineConsts';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import {
  addressFromPublicKey,
  privateKeyFromOriginPrivateKey,
  publicKeyFromOriginPubkey,
} from './sdk';
import { signTransaction, toTransaction } from './sdk/transaction';

import type { PrivateKey } from '@kaspa/core-lib';

// @ts-ignore
export class KeyringImported extends KeyringImportedBase {
  override async getSigners(password: string, addresses: Array<string>) {
    const dbAccount = await this.getDbAccount();

    if (addresses.length !== 1) {
      throw new DeusInternalError('Kaspa signers number should be 1.');
    } else if (addresses[0] !== dbAccount.address) {
      throw new DeusInternalError('Wrong address required for signing.');
    }

    const { [dbAccount.path]: privateKey } = await this.getPrivateKeys(
      password,
    );
    if (typeof privateKey === 'undefined') {
      throw new DeusInternalError('Unable to get signer.');
    }

    return {
      [dbAccount.address]: new Signer(privateKey, password, 'secp256k1'),
    };
  }

  override async prepareAccounts(
    params: IPrepareImportedAccountsParams,
  ): Promise<Array<DBSimpleAccount>> {
    const { privateKey, name } = params;

    if (privateKey.length !== 32) {
      throw new DeusInternalError('Invalid private key.');
    }

    const chainId = await this.getNetworkChainId();

    const pubkey = secp256k1.publicFromPrivate(privateKey);
    const originPub = bytesToHex(pubkey);

    const publicKey = publicKeyFromOriginPubkey(pubkey);
    const address = addressFromPublicKey(publicKey, chainId);

    return [
      {
        id: `imported--${COIN_TYPE}--${originPub}`,
        name,
        type: AccountType.SIMPLE,
        path: '',
        coinType: COIN_TYPE,
        pub: originPub,
        address,
      },
    ];
  }

  override async signTransaction(
    unsignedTx: UnsignedTx,
    options: ISignCredentialOptions,
  ): Promise<SignedTxResult> {
    debugLogger.common.info('signTransaction result', unsignedTx);
    const dbAccount = (await this.getDbAccount()) as DBSimpleAccount;
    const sender = dbAccount.address;
    const signers = await this.getSigners(options.password || '', [sender]);
    const signer = signers[sender];

    const chainId = await this.getNetworkChainId();
    const { encodedTx } = unsignedTx.payload;
    const txn = toTransaction(encodedTx);

    const signedTx = await signTransaction(txn, {
      getPublicKey() {
        return publicKeyFromOriginPubkey(
          Buffer.from(hexToBytes(dbAccount.pub)),
        );
      },
      async getPrivateKey(): Promise<PrivateKey> {
        const privateKey = await signer.getPrvkey();
        const publicKey = await signer.getPubkey(true);
        return privateKeyFromOriginPrivateKey(privateKey, publicKey, chainId);
      },
    });

    return {
      txid: '',
      rawTx: signedTx,
    };
  }
}
