import { COINTYPE_STC as COIN_TYPE } from '@deushq/shared/src/engine/engineConsts';

import { InvalidAddress } from '../../../../errors';
import { AccountType } from '../../../../types/account';
import { KeyringWatchingBase } from '../../../keyring/KeyringWatchingBase';
import { verifyAddress } from '../utils';

import type { DBSimpleAccount } from '../../../../types/account';
import type { IPrepareWatchingAccountsParams } from '../../../types';

export class KeyringWatching extends KeyringWatchingBase {
  override async prepareAccounts(
    params: IPrepareWatchingAccountsParams,
  ): Promise<Array<DBSimpleAccount>> {
    const { name, target, accountIdPrefix } = params;
    const { normalizedAddress, isValid } = verifyAddress(target);
    if (!isValid || typeof normalizedAddress === 'undefined') {
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
