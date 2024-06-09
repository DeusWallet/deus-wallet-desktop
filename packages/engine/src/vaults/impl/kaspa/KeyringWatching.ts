import { InvalidAddress } from '@deushq/engine/src/errors';
import { AccountType } from '@deushq/engine/src/types/account';
import type { DBSimpleAccount } from '@deushq/engine/src/types/account';
import { KeyringWatchingBase } from '@deushq/engine/src/vaults/keyring/KeyringWatchingBase';
import type { IPrepareWatchingAccountsParams } from '@deushq/engine/src/vaults/types';
import { COINTYPE_KASPA as COIN_TYPE } from '@deushq/shared/src/engine/engineConsts';

// @ts-ignore
export class KeyringWatching extends KeyringWatchingBase {
  override async prepareAccounts(
    params: IPrepareWatchingAccountsParams,
  ): Promise<Array<DBSimpleAccount>> {
    const { name, target, accountIdPrefix } = params;

    const normalizedAddress = await this.vault.validateAddress(target);

    if (typeof normalizedAddress === 'undefined') {
      throw new InvalidAddress();
    }

    return Promise.resolve([
      {
        id: `${accountIdPrefix}--${COIN_TYPE}--${target}`,
        name: name || '',
        type: AccountType.SIMPLE,
        path: '',
        coinType: COIN_TYPE,
        pub: '', // TODO: only address is supported for now.
        address: normalizedAddress,
      },
    ]);
  }
}
