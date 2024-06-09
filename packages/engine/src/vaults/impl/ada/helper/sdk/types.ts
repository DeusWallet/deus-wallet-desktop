export type IGetCardanoApi = () => Promise<IAdaSdkApi>;

export type IEnsureSDKReady = () => Promise<boolean>;

export interface IAdaSdk {
  getCardanoApi: IGetCardanoApi;
  ensureSDKReady: IEnsureSDKReady;
}

export interface IAdaSdkApi {
  composeTxPlan: typeof import('@deusfe/cardano-coin-selection').deusUtils.composeTxPlan;
  signTransaction: typeof import('@deusfe/cardano-coin-selection').deusUtils.signTransaction;
  hwSignTransaction: typeof import('@deusfe/cardano-coin-selection').trezorUtils.signTransaction;
  txToDeus: typeof import('@deusfe/cardano-coin-selection').deusUtils.txToDeus;
  dAppGetBalance: typeof import('@deusfe/cardano-coin-selection').dAppUtils.getBalance;
  dAppGetAddresses: typeof import('@deusfe/cardano-coin-selection').dAppUtils.getAddresses;
  dAppGetUtxos: typeof import('@deusfe/cardano-coin-selection').dAppUtils.getUtxos;
  dAppConvertCborTxToEncodeTx: typeof import('@deusfe/cardano-coin-selection').dAppUtils.convertCborTxToEncodeTx;
  dAppSignData: typeof import('@deusfe/cardano-coin-selection').dAppUtils.signData;
}
