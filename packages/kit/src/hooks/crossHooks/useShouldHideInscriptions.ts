import { isNil } from 'lodash';

import { DeusNetwork } from '@deushq/shared/src/config/networkIds';
import { SEPERATOR } from '@deushq/shared/src/engine/engineConsts';

import { buildCrossHooksWithOptions } from './buildCrossHooks';

export const {
  use: useShouldHideInscriptions,
  get: getShouldHideInscriptions,
} = buildCrossHooksWithOptions<
  boolean,
  {
    accountId: string;
    networkId: string;
  }
>((selector, { options }) => {
  const { hideInscriptions } = selector((s) => s.settings);
  const { accountId, networkId } = options;

  let shouldHideInscriptions = false;

  if (networkId === DeusNetwork.btc || networkId === DeusNetwork.tbtc) {
    const state = hideInscriptions?.[accountId];
    if (isNil(state)) {
      // taproot enable inscriptions by default
      if (
        accountId?.includes(`86'/`) ||
        accountId?.split(SEPERATOR)[2]?.startsWith('bc1p') ||
        accountId?.split(SEPERATOR)[2]?.startsWith('tb1p')
      ) {
        shouldHideInscriptions = false;
      } else {
        shouldHideInscriptions = true;
      }
    } else {
      shouldHideInscriptions = state;
    }
  }

  return shouldHideInscriptions;
});
