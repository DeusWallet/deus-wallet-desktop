import adaWebSdk from '@deushq/engine/src/vaults/impl/ada/helper/sdk/adaWebSdk';
import type { IAdaSdkApi } from '@deushq/engine/src/vaults/impl/ada/helper/sdk/types';
import { wait } from '@deushq/kit/src/utils/helper';

export default class OffscreenApiAdaSdk implements IAdaSdkApi {
  async sayHello() {
    await wait(3000);
    return 'Hello World: OffscreenApiAdaSdk';
  }

  async composeTxPlan(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.composeTxPlan(...args);
  }

  async signTransaction(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.signTransaction(...args);
  }

  async hwSignTransaction(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.hwSignTransaction(...args);
  }

  async txToDeus(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.txToDeus(...args);
  }

  async dAppGetBalance(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppGetBalance(...args);
  }

  async dAppGetAddresses(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppGetAddresses(...args);
  }

  async dAppGetUtxos(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppGetUtxos(...args);
  }

  async dAppConvertCborTxToEncodeTx(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppConvertCborTxToEncodeTx(...args);
  }

  async dAppSignData(...args: any[]) {
    const api = await adaWebSdk.getCardanoApi();
    // @ts-ignore
    return api.dAppSignData(...args);
  }
}
