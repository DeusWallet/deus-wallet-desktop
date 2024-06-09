/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { memo, useCallback, useEffect } from 'react';

import { Center, Text } from '@deushq/components';
import platformEnv from '@deushq/shared/src/platformEnv';

import type { IJsonRpcRequest } from '@deusfe/cross-inpage-provider-types';

const LibLoader = async () => import('@deusfe/cardano-coin-selection-asmjs');

const getCardanoApi = async () => {
  const Loader = await LibLoader();
  return {
    composeTxPlan: Loader.deusUtils.composeTxPlan,
    signTransaction: Loader.deusUtils.signTransaction,
    hwSignTransaction: Loader.trezorUtils.signTransaction,
    txToDeus: Loader.deusUtils.txToDeus,
    dAppUtils: Loader.dAppUtils,
  };
};

const ProvideResponseMethod = 'chainWebEmbedResponse';

enum CardanoEvent {
  composeTxPlan = 'Cardano_composeTxPlan',
  signTransaction = 'Cardano_signTransaction',
  hwSignTransaction = 'Cardano_hwSignTransaction',
  txToDeus = 'Cardano_txToDeus',
  dAppGetBalance = 'Cardano_DAppGetBalance',
  dAppGetAddresses = 'Cardano_DAppGetAddresses',
  dAppGetUtxos = 'Cardano_DAppGetUtxos',
  dAppConvertCborTxToEncodeTx = 'Cardano_DAppConvertCborTxToEncodeTx',
  dAppSignData = 'Cardano_DAppSignData',
}

let testCallingCount = 1;
let testCallingInterval: ReturnType<typeof setInterval> | undefined;
function WebEmbedWebviewAgentCardano() {
  const sendResponse = useCallback((promiseId: number, result: any) => {
    window.$deus.$private.request({
      method: ProvideResponseMethod,
      promiseId,
      data: result,
    });
  }, []);

  const handler = useCallback(
    async (payload: IJsonRpcRequest) => {
      console.log('WebEmbedWebviewAgentCardano Recive Message: ', payload);
      console.log('params: ', JSON.stringify(payload.params));
      const { method, params } = payload;

      if (method !== 'callChainWebEmbedMethod') {
        return;
      }

      const { params: eventParams, promiseId, event } = params as any;

      const CardanoApi = await getCardanoApi();
      switch (event) {
        case CardanoEvent.composeTxPlan: {
          console.log('Cardano_composeTxPlan');
          const { transferInfo, xpub, utxos, changeAddress, outputs } =
            eventParams;
          try {
            const txPlan = await CardanoApi.composeTxPlan(
              transferInfo,
              xpub,
              utxos,
              changeAddress,
              outputs,
            );
            sendResponse(promiseId, { error: null, result: txPlan });
          } catch (error: any) {
            sendResponse(promiseId, {
              error: error?.code || error,
              result: null,
            });
          }
          break;
        }

        case CardanoEvent.signTransaction: {
          console.log('Cardano_signTransaction');
          const { txBodyHex, address, accountIndex, utxos, xprv, partialSign } =
            eventParams;
          try {
            const result = await CardanoApi.signTransaction(
              txBodyHex,
              address,
              accountIndex,
              utxos,
              xprv,
              partialSign,
            );
            sendResponse(promiseId, { error: null, result });
          } catch (error) {
            sendResponse(promiseId, { error, result: null });
          }
          break;
        }

        case CardanoEvent.hwSignTransaction: {
          const { txBodyHex, signedWitnesses, options } = eventParams;
          try {
            const result = await CardanoApi.hwSignTransaction(
              txBodyHex,
              signedWitnesses,
              options,
            );
            sendResponse(promiseId, { error: null, result });
          } catch (error) {
            sendResponse(promiseId, { error, result: null });
          }
          break;
        }

        case CardanoEvent.txToDeus: {
          const { rawTx, network, initKeys, xpub, changeAddress } = eventParams;
          try {
            const result = await CardanoApi.txToDeus(
              rawTx,
              network,
              initKeys,
              xpub,
              changeAddress,
            );
            sendResponse(promiseId, { error: null, result });
          } catch (error) {
            sendResponse(promiseId, { error, result: null });
          }
          break;
        }

        case CardanoEvent.dAppGetBalance: {
          const { balances } = eventParams;
          try {
            const result = await CardanoApi.dAppUtils.getBalance(balances);
            sendResponse(promiseId, { error: null, result });
          } catch (error) {
            sendResponse(promiseId, { error, result: null });
          }
          break;
        }

        case CardanoEvent.dAppGetUtxos: {
          const { address, utxos, amount } = eventParams;
          try {
            const result = await CardanoApi.dAppUtils.getUtxos(
              address,
              utxos,
              amount,
            );
            sendResponse(promiseId, { error: null, result });
          } catch (error) {
            sendResponse(promiseId, { error, result: null });
          }
          break;
        }

        case CardanoEvent.dAppGetAddresses: {
          const { addresses } = eventParams;
          try {
            const result = await CardanoApi.dAppUtils.getAddresses(addresses);
            sendResponse(promiseId, { error: null, result });
          } catch (error) {
            sendResponse(promiseId, { error, result: null });
          }
          break;
        }

        case CardanoEvent.dAppConvertCborTxToEncodeTx: {
          const { txHex, utxos, addresses, changeAddress } = eventParams;
          try {
            const result = await CardanoApi.dAppUtils.convertCborTxToEncodeTx(
              txHex,
              utxos,
              addresses,
              changeAddress,
            );
            sendResponse(promiseId, { error: null, result });
          } catch (error) {
            sendResponse(promiseId, { error, result: null });
          }
          break;
        }

        case CardanoEvent.dAppSignData: {
          const {
            address,
            payload: signPayload,
            xprv,
            accountIndex,
          } = eventParams;
          try {
            const result = await CardanoApi.dAppUtils.signData(
              address,
              signPayload,
              xprv,
              accountIndex,
            );
            sendResponse(promiseId, { error: null, result });
          } catch (error) {
            sendResponse(promiseId, { error, result: null });
          }
          break;
        }

        default:
          break;
      }
    },
    [sendResponse],
  );

  useEffect(() => {
    if (!window.$deus) {
      return;
    }
    window.$deus.$private.on('message_low_level', handler);
    return () => {
      window.$deus.$private.off('message_low_level', handler);
    };
  }, [handler]);

  return (
    <Center p={4} bgColor="surface-warning-subdued" minH="100%">
      <Text
        onPress={() => {
          if (platformEnv.isDev) {
            clearInterval(testCallingInterval);
            testCallingInterval = setInterval(() => {
              // eslint-disable-next-line no-plusplus
              const content = `call private method interval::::   ${testCallingCount++}  `;
              console.log(content);
              window.$deus.$private.request({
                method: ProvideResponseMethod,
                data: content,
              });
            }, 3000);
          }
        }}
      >
        Cardano web-embed Webview Agent
      </Text>
    </Center>
  );
}

export default memo(WebEmbedWebviewAgentCardano);
