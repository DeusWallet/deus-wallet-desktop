import type { Account as AccountEngineType } from '@deushq/engine/src/types/account';
import type { Network } from '@deushq/engine/src/types/network';

export type AccountGroup = { title: Network; data: AccountEngineType[] };
