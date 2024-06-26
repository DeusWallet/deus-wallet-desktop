import { batchGetPublicKeys } from '@deushq/engine/src/secret';
import type { SignedTx } from '@deushq/engine/src/types/provider';
import { COINTYPE_CFX as COIN_TYPE } from '@deushq/shared/src/engine/engineConsts';

import { DeusInternalError } from '../../../../errors';
import { Signer, Verifier } from '../../../../proxy';
import { AccountType } from '../../../../types/account';
import { KeyringHdBase } from '../../../keyring/KeyringHdBase';
import { pubkeyToAddress, signTransactionWithSigner } from '../utils';

import { CURVE_NAME } from './constant';

import type { ExportedSeedCredential } from '../../../../dbs/base';
import type { DBVariantAccount } from '../../../../types/account';
import type {
  IPrepareSoftwareAccountsParams,
  ISignCredentialOptions,
  IUnsignedTxPro,
} from '../../../types';

const PATH_PREFIX = `m/44'/${COIN_TYPE}'/0'/0`;

export class KeyringHd extends KeyringHdBase {
  override async getSigners(password: string, addresses: Array<string>) {
    const dbAccount = (await this.getDbAccount()) as DBVariantAccount;
    const selectedAddress = dbAccount.addresses[this.networkId];

    if (addresses.length !== 1) {
      throw new DeusInternalError('CFX signers number should be 1.');
    } else if (addresses[0] !== selectedAddress) {
      throw new DeusInternalError('Wrong address required for signing.');
    }

    const { [dbAccount.path]: privateKey } = await this.getPrivateKeys(
      password,
    );
    if (typeof privateKey === 'undefined') {
      throw new DeusInternalError('Unable to get signer.');
    }

    return { [selectedAddress]: new Signer(privateKey, password, CURVE_NAME) };
  }

  override async prepareAccounts(
    params: IPrepareSoftwareAccountsParams,
  ): Promise<Array<DBVariantAccount>> {
    const { password, indexes, names } = params;
    const { seed } = (await this.engine.dbApi.getCredential(
      this.walletId,
      password,
    )) as ExportedSeedCredential;
    const pubkeyInfos = batchGetPublicKeys(
      CURVE_NAME,
      seed,
      password,
      PATH_PREFIX,
      indexes.map((index) => index.toString()),
    );

    if (pubkeyInfos.length !== indexes.length) {
      throw new DeusInternalError('Unable to get publick key.');
    }

    const ret = [];
    let index = 0;
    for (const info of pubkeyInfos) {
      const {
        path,
        extendedKey: { key: pubkey },
      } = info;
      const pub = pubkey.toString('hex');
      const chainId = await this.vault.getNetworkChainId();
      const addressOnNetwork = await pubkeyToAddress(
        new Verifier(pub, CURVE_NAME),
        chainId,
      );
      const baseAddress = await this.vault.addressToBase(addressOnNetwork);
      const name = (names || [])[index] || `CFX #${indexes[index] + 1}`;
      ret.push({
        id: `${this.walletId}--${path}`,
        name,
        type: AccountType.VARIANT,
        path,
        coinType: COIN_TYPE,
        pub,
        address: baseAddress,
        addresses: { [this.networkId]: addressOnNetwork },
      });
      index += 1;
    }
    return ret;
  }

  override async signTransaction(
    unsignedTx: IUnsignedTxPro,
    options: ISignCredentialOptions,
  ): Promise<SignedTx> {
    const dbAccount = await this.getDbAccount();
    const selectedAddress = (dbAccount as DBVariantAccount).addresses[
      this.networkId
    ];

    const signers = await this.getSigners(options.password || '', [
      selectedAddress,
    ]);
    const signer = signers[selectedAddress];
    return signTransactionWithSigner(unsignedTx, signer);
  }

  override async signMessage(
    messages: any[],
    options: ISignCredentialOptions,
  ): Promise<string[]> {
    const { password } = options;
    if (typeof password === 'undefined') {
      throw new DeusInternalError('Software signing requires a password.');
    }

    const dbAccount = await this.getDbAccount();
    const selectedAddress = (dbAccount as DBVariantAccount).addresses[
      this.networkId
    ];

    const signers = await this.getSigners(options.password || '', [
      selectedAddress,
    ]);
    const signer = signers[selectedAddress];

    return Promise.all(
      messages.map((message) =>
        this.engine.providerManager.signMessage(
          this.networkId,
          message,
          signer,
        ),
      ),
    );
  }
}
