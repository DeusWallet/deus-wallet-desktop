import type { NostrEvent } from '@deushq/engine/src/vaults/impl/nostr/helper/types';
import type { IDappSourceInfo } from '@deushq/shared/types';

import { NostrModalRoutes } from '../../routes/routesEnum';

export { NostrModalRoutes };

export type NostrRoutesParams = {
  [NostrModalRoutes.GetPublicKey]: {
    sourceInfo: IDappSourceInfo;
  };
  [NostrModalRoutes.SignEvent]: {
    sourceInfo: IDappSourceInfo;
    event?: NostrEvent;
    pubkey?: string;
    plaintext?: string;
    ciphertext?: string;
    sigHash?: string;
  };
  [NostrModalRoutes.NostrAuthentication]: {
    onDone: (password: string) => void;
    walletId: string;
    networkId: string;
    accountId: string;
  };
  [NostrModalRoutes.ExportPubkey]: {
    walletId: string;
    networkId: string;
    accountId: string;
  };
};
