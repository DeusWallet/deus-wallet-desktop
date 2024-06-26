/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unused-vars */
import { bridgeSetup } from '@deusfe/extension-bridge-hosted';

import offscreenApi from '@deushq/kit-bg/src/offscreens/instance/offscreenApi';
import type { IOffscreenApiMessagePayload } from '@deushq/kit-bg/src/offscreens/types';
import { OFFSCREEN_API_MESSAGE_TYPE } from '@deushq/kit-bg/src/offscreens/types';

export function offscreenSetup() {
  const offscreenBridge = bridgeSetup.offscreen.createOffscreenJsBridge({
    onPortConnect() {},
    async receiveHandler(payload, bridge) {
      const msg = payload.data as IOffscreenApiMessagePayload | undefined;
      if (msg && msg.type === OFFSCREEN_API_MESSAGE_TYPE) {
        const { module, method, params } = msg;
        const moduleInstance: any = await offscreenApi.createOffscreenApiModule(
          module,
        );
        if (moduleInstance && moduleInstance[method]) {
          // TODO error handling
          const result = await moduleInstance[method](...params);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return result;
        }
        throw new Error(
          `offscreen module method not found: ${module}.${method}()`,
        );
      }
    },
  });
  window.extJsBridgeOffscreenToBg = offscreenBridge;

  return offscreenBridge;

  // chrome.runtime.sendMessage
  // chrome.runtime.onMessage.addListener(
  //   (msg: IOffscreenApiMessagePayload, sender, sendResponse) => {
  //     (async () => {
  //       if (msg && msg.type === OFFSCREEN_API_MESSAGE_TYPE) {
  //         const { module, method, params } = msg;
  //         const sdk: any = await getModuleByName(module);
  //         if (sdk && sdk[method]) {
  //           // TODO error handling
  //           const result = await sdk[method](...params);
  //           sendResponse(result);
  //         } else {
  //           throw new Error(
  //             `offscreen module method not found: ${module}.${method}()`,
  //           );
  //         }
  //       }
  //     })();
  //
  //     // **** return true to indicate that sendResponse is async
  //     return true;
  //   },
  // );
}
