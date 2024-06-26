/* eslint-disable @typescript-eslint/require-await,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return */

import {
  PROVIDER_API_METHOD_PREFIX,
  backgroundClass,
} from '@deushq/shared/src/background/backgroundDecorators';
import { throwMethodNotFound } from '@deushq/shared/src/background/backgroundUtils';

import type { IBackgroundApi } from '../IBackgroundApi';
import type {
  IInjectedProviderNamesStrings,
  IJsBridgeMessagePayload,
  IJsonRpcRequest,
} from '@deusfe/cross-inpage-provider-types';

export type IProviderBaseBackgroundNotifyInfo = {
  send: (data: any) => void;
};

@backgroundClass()
abstract class ProviderApiBase {
  constructor({ backgroundApi }: { backgroundApi: any }) {
    this.backgroundApi = backgroundApi;
  }

  backgroundApi: IBackgroundApi;

  public abstract providerName: IInjectedProviderNamesStrings;

  public abstract notifyDappAccountsChanged(
    info: IProviderBaseBackgroundNotifyInfo,
  ): void;

  public abstract notifyDappChainChanged(
    info: IProviderBaseBackgroundNotifyInfo,
  ): void;

  public abstract rpcCall(request: IJsonRpcRequest): any;

  async handleMethods(payload: IJsBridgeMessagePayload) {
    const { data } = payload;
    const request = data as IJsonRpcRequest;
    const { method, params = [] } = request;
    const paramsArr = [].concat(params as any);
    const methodName = `${PROVIDER_API_METHOD_PREFIX}${method}`;

    const methodFunc = (this as any)[methodName];
    const originMethodFunc = (this as any)[method];

    if (originMethodFunc && !methodFunc) {
      return throwMethodNotFound(
        'ProviderApi',
        payload.scope || '',
        methodName,
      );
    }
    if (methodFunc) {
      return methodFunc.call(this, payload, ...paramsArr);
    }
    return this.rpcCall(request);

    // TODO
    //  exists methods
    //  RPC methods
    //  throwMethodNotFound
  }
}

export default ProviderApiBase;
