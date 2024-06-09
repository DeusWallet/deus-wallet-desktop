import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

import { HardwareDisabledInfo, XmrDisabledInfo } from './XmrDisabledInfo';

export function NetWorkDisabledInfo({
  networkId,
}: {
  networkId?: string;
  accountId?: string;
}) {
  if (networkId === DeusNetwork.xmr) {
    return <XmrDisabledInfo />;
  }

  if (
    networkId &&
    [DeusNetwork.lightning, DeusNetwork.tlightning].includes(networkId)
  ) {
    return <HardwareDisabledInfo networkId={networkId} />;
  }

  return null;
}
