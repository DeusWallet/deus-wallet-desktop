import type { FC } from 'react';
import { useMemo } from 'react';

import type { IDecodedTx } from '@deushq/engine/src/vaults/types';

import { useClipboard } from '../../../hooks/useClipboard';
import { useNetwork } from '../../../hooks/useNetwork';
import useOpenBlockBrowser from '../../../hooks/useOpenBlockBrowser';
import BaseMenu from '../../Overlay/BaseMenu';

import type { IBaseMenuOptions, IMenu } from '../../Overlay/BaseMenu';

interface Props extends IMenu {
  decodedTx: IDecodedTx;
}
export const TxDetailHashMoreMenu: FC<Props> = (props) => {
  const { decodedTx } = props;
  const { copyText } = useClipboard();
  const { network } = useNetwork({ networkId: decodedTx.networkId });
  const openBlockBrowser = useOpenBlockBrowser(network);
  const options = useMemo(() => {
    const baseOptions: IBaseMenuOptions = [
      {
        id: 'action_copy_hash',
        onPress: () => copyText(decodedTx.txid),
        icon: 'Square2StackMini',
      },
      openBlockBrowser.hasAvailable && {
        id: 'action__view_in_browser',
        onPress: () => openBlockBrowser.openTransactionDetails(decodedTx.txid),
        icon: 'GlobeAltMini',
      },
    ];
    return baseOptions;
  }, [copyText, decodedTx.txid, openBlockBrowser]);

  return <BaseMenu options={options} {...props} />;
};
