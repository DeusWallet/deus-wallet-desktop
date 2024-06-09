// getNetworkImplFromNetworkId
// getImplFromNetworkId
import { SEPERATOR } from '@deushq/shared/src/engine/engineConsts';

export function getNetworkImpl(networkId: string) {
  const [impl] = networkId.split(SEPERATOR);
  return impl;
}
