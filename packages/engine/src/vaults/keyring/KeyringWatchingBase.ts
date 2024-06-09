/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/require-await */

import type { SignedTx, UnsignedTx } from '@deushq/engine/src/types/provider';

import { DeusInternalError } from '../../errors';

import { KeyringBase } from './KeyringBase';

import type { ISignCredentialOptions } from '../types';

export abstract class KeyringWatchingBase extends KeyringBase {
  async signTransaction(
    unsignedTx: UnsignedTx,
    options: ISignCredentialOptions,
  ): Promise<SignedTx> {
    throw new DeusInternalError(
      'signTransaction is not supported for watching accounts',
    );
  }

  async signMessage(
    messages: any[],
    options: ISignCredentialOptions,
  ): Promise<string[]> {
    throw new DeusInternalError(
      'signMessage is not supported for watching accounts',
    );
  }

  // prepareAccounts(params: any): Promise<Array<any>> {
  //   throw new DeusInternalError(
  //     'prepareAccounts is not supported for watching accounts',
  //   );
  // }

  override getAddress(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  override batchGetAddress(): Promise<{ path: string; address: string }[]> {
    throw new Error('Method not implemented.');
  }

  override prepareAccountByAddressIndex(): Promise<[]> {
    throw new Error('Method not implemented.');
  }
}
