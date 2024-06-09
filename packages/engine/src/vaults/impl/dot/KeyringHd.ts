import { bytesToHex } from '@noble/hashes/utils';

import type { ExportedSeedCredential } from '@deushq/engine/src/dbs/base';
import { DeusInternalError } from '@deushq/engine/src/errors';
import { getAccountNameInfoByImpl } from '@deushq/engine/src/managers/impl';
import { Signer } from '@deushq/engine/src/proxy';
import { mnemonicFromEntropy } from '@deushq/engine/src/secret';
import { encrypt } from '@deushq/engine/src/secret/encryptors/aes256';
import type { DBVariantAccount } from '@deushq/engine/src/types/account';
import { AccountType } from '@deushq/engine/src/types/account';
import type { CommonMessage } from '@deushq/engine/src/types/message';
import type { UnsignedTx } from '@deushq/engine/src/types/provider';
import { KeyringHdBase } from '@deushq/engine/src/vaults/keyring/KeyringHdBase';
import type {
  IPrepareSoftwareAccountsParams,
  ISignCredentialOptions,
  ISignedTxPro,
} from '@deushq/engine/src/vaults/types';
import { addHexPrefix } from '@deushq/engine/src/vaults/utils/hexUtils';
import {
  IMPL_DOT as COIN_IMPL,
  COINTYPE_DOT as COIN_TYPE,
} from '@deushq/shared/src/engine/engineConsts';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import { TYPE_PREFIX } from './consts';
import polkadotSdk from './sdk/polkadotSdk';
import { derivationHdLedger } from './utils';

import type { DotImplOptions } from './types';
import type Vault from './Vault';

const { bufferToU8a, u8aConcat } = polkadotSdk;

const HARDEN_PATH_PREFIX = `m/44'/${COIN_TYPE}'`;

// @ts-ignore
export class KeyringHd extends KeyringHdBase {
  private async getChainInfo() {
    return this.engine.providerManager.getChainInfoByNetworkId(this.networkId);
  }

  private async getChainInfoImplOptions(): Promise<DotImplOptions> {
    const chainInfo = await this.getChainInfo();
    return chainInfo.implOptions as DotImplOptions;
  }

  override async getPrivateKeys(
    password: string,
    relPaths?: Array<string>,
  ): Promise<Record<string, Buffer>> {
    const dbAccount = await this.getDbAccount();
    const pathComponents = dbAccount.path.split('/');
    const usedRelativePaths = relPaths || [pathComponents.pop() as string];
    const basePath = pathComponents.join('/');

    const { entropy } = (await this.engine.dbApi.getCredential(
      this.walletId,
      password,
    )) as ExportedSeedCredential;
    if (typeof entropy === 'undefined') {
      throw new DeusInternalError('Unable to get credential.');
    }

    const mnemonic = mnemonicFromEntropy(entropy, password);
    const keys = usedRelativePaths.map((relPath) => {
      const path = `${basePath}/${relPath}`;

      const keyPair = derivationHdLedger(mnemonic, path);
      return {
        path,
        key: encrypt(password, Buffer.from(keyPair.secretKey.slice(0, 32))),
      };
    });

    return keys.reduce((ret, key) => ({ ...ret, [key.path]: key.key }), {});
  }

  override async getSigners(password: string, addresses: Array<string>) {
    const dbAccount = (await this.getDbAccount()) as DBVariantAccount;
    const selectedAddress = dbAccount.address;

    if (addresses.length !== 1) {
      throw new DeusInternalError('Polkadot signers number should be 1.');
    } else if (addresses[0] !== selectedAddress) {
      throw new DeusInternalError('Wrong address required for signing.');
    }

    const privateKeys = await this.getPrivateKeys(password);

    const { [dbAccount.path]: privateKey } = privateKeys;
    if (typeof privateKey === 'undefined') {
      throw new DeusInternalError('Unable to get signer.');
    }

    return {
      [selectedAddress]: new Signer(privateKey, password, 'ed25519'),
    };
  }

  override async prepareAccounts(
    params: IPrepareSoftwareAccountsParams,
  ): Promise<Array<DBVariantAccount>> {
    const { password, indexes, names } = params;
    const { entropy } = (await this.engine.dbApi.getCredential(
      this.walletId,
      password,
    )) as ExportedSeedCredential;

    const mnemonic = mnemonicFromEntropy(entropy, password);

    const publicKeys = indexes.map((index) => {
      const path = `${HARDEN_PATH_PREFIX}/${index}'/0'/0'`;
      const keyPair = derivationHdLedger(mnemonic, path);
      return {
        path,
        pubkey: keyPair.publicKey,
      };
    });

    if (publicKeys.length !== indexes.length) {
      throw new DeusInternalError('Unable to get public key.');
    }

    const ret = [];
    let index = 0;
    for (const info of publicKeys) {
      const { path, pubkey } = info;

      const { prefix } = getAccountNameInfoByImpl(COIN_IMPL).default;

      const name = (names || [])[index] || `${prefix} #${indexes[index] + 1}`;
      ret.push({
        id: `${this.walletId}--${path}`,
        name,
        type: AccountType.VARIANT,
        path,
        coinType: COIN_TYPE,
        pub: bytesToHex(pubkey),
        address: '',
        addresses: {},
      });
      index += 1;
    }
    return ret;
  }

  override async signTransaction(
    unsignedTx: UnsignedTx,
    options: ISignCredentialOptions,
  ): Promise<ISignedTxPro> {
    debugLogger.common.info('signTransaction result', unsignedTx);
    const dbAccount = await this.getDbAccount();

    const vault = this.vault as Vault;

    const { hash: message } = await vault.serializeUnsignedTransaction(
      unsignedTx.payload.encodedTx,
    );

    const signers = await this.getSigners(options.password || '', [
      dbAccount.address,
    ]);
    const signer = signers[dbAccount.address];

    const senderPublicKey = unsignedTx.inputs?.[0]?.publicKey;
    if (!senderPublicKey) {
      throw new DeusInternalError('Unable to get sender public key.');
    }

    const [signature] = await signer.sign(Buffer.from(message));
    const txSignature = u8aConcat(TYPE_PREFIX.ed25519, bufferToU8a(signature));

    // Serialize a signed transaction.
    const tx = await vault.serializeSignedTransaction(
      unsignedTx.payload.encodedTx,
      bytesToHex(txSignature),
    );

    return Promise.resolve({
      txid: '',
      rawTx: tx,
      signature: addHexPrefix(bytesToHex(txSignature)),
    });
  }

  override async signMessage(
    messages: CommonMessage[],
    options: ISignCredentialOptions,
  ): Promise<string[]> {
    const dbAccount = await this.getDbAccount();
    const signers = await this.getSigners(options.password || '', [
      dbAccount.address,
    ]);
    const signer = signers[dbAccount.address];
    const vault = this.vault as Vault;

    return Promise.all(
      messages.map(async (message) => {
        const wrapMessage = await vault.serializeMessage(message.message);
        const [signature] = await signer.sign(wrapMessage);
        const txSignature = u8aConcat(
          TYPE_PREFIX.ed25519,
          bufferToU8a(signature),
        );
        return addHexPrefix(bytesToHex(txSignature));
      }),
    );
  }
}
