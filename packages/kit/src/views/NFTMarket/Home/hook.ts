import { useMemo } from 'react';

import type { Network } from '@deushq/engine/src/types/network';
import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

import { useNetworks } from '../../../hooks/redux';

const ethNetwokId = DeusNetwork.eth;

export function useDefaultNetWork() {
  const networks = useNetworks();
  return useMemo(() => {
    const ethNetWork = networks.find((n) => n.id === ethNetwokId);
    return ethNetWork as Network;
  }, [networks]);
}
