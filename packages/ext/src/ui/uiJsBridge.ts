import { bridgeSetup } from '@deusfe/extension-bridge-hosted';

import store from '@deushq/kit/src/store';
import type { IDispatchActionBroadcastParams } from '@deushq/shared/src/background/backgroundUtils';
import {
  DISPATCH_ACTION_BROADCAST_METHOD_NAME,
  buildReduxBatchAction,
} from '@deushq/shared/src/background/backgroundUtils';

import type {
  IJsBridgeMessagePayload,
  IJsonRpcRequest,
} from '@deusfe/cross-inpage-provider-types';

function init() {
  const jsBridgeReceiveHandler = (payload: IJsBridgeMessagePayload) => {
    // console.log('jsBridgeReceiveHandler Ext-UI', payload);
    const { method, params } = payload.data as IJsonRpcRequest;
    if (method === DISPATCH_ACTION_BROADCAST_METHOD_NAME) {
      const { actions } = params as IDispatchActionBroadcastParams;
      if (actions && actions.length) {
        const actionData = buildReduxBatchAction(...actions);
        if (actionData) {
          // * update Ext ui store
          store.dispatch(actionData);
        }
      }
    }
  };
  // TODO rename global.$extensionJsBridgeUiToBg
  window.extJsBridgeUiToBg = bridgeSetup.ui.createUiJsBridge({
    receiveHandler: jsBridgeReceiveHandler,
    onPortConnect() {
      // use <WaitBackgroundReady /> instead
      // legacy method:    syncWholeStoreState();
    },
  });
}

export default {
  init,
};
