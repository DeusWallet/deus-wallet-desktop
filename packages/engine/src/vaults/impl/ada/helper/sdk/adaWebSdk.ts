import type { IGetCardanoApi } from './types';

const getCardanoApi: IGetCardanoApi = async () => {
  const Loader = await import('@deusfe/cardano-coin-selection-asmjs');
  return {
    composeTxPlan: Loader.deusUtils.composeTxPlan,
    signTransaction: Loader.deusUtils.signTransaction,
    hwSignTransaction: Loader.trezorUtils.signTransaction,
    txToDeus: Loader.deusUtils.txToDeus,
    dAppGetBalance: Loader.dAppUtils.getBalance,
    dAppGetAddresses: Loader.dAppUtils.getAddresses,
    dAppGetUtxos: Loader.dAppUtils.getUtxos,
    dAppConvertCborTxToEncodeTx: Loader.dAppUtils.convertCborTxToEncodeTx,
    dAppSignData: Loader.dAppUtils.signData,
  };
};

export default {
  getCardanoApi,
};
