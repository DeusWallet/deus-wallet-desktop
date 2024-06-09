import {
  COINTYPE_BCH,
  INDEX_PLACEHOLDER,
} from '@deushq/shared/src/engine/engineConsts';

import { BulkTypeEnum } from '../../../types/batchTransfer';

import type { IVaultSettings } from '../../types';

const settings: IVaultSettings = Object.freeze({
  feeInfoEditable: true,
  privateKeyExportEnabled: true,
  publicKeyExportEnabled: true,
  tokenEnabled: false,
  txCanBeReplaced: false,

  importedAccountEnabled: true,
  hardwareAccountEnabled: true,
  externalAccountEnabled: false,
  watchingAccountEnabled: true,

  minTransferAmount: '0.00000546',

  isUTXOModel: true,
  supportBatchTransfer: [BulkTypeEnum.OneToMany],
  nativeSupportBatchTransfer: true,

  accountNameInfo: {
    default: {
      prefix: 'BCH',
      category: `44'/${COINTYPE_BCH}'`,
      template: `m/44'/${COINTYPE_BCH}'/${INDEX_PLACEHOLDER}'/0/0`,
      coinType: COINTYPE_BCH,
      label: 'Legacy',
      subDesc: 'BIP44, P2PKH, Base58.',
    },
  },

  isBtcForkChain: true,
});

export default settings;
