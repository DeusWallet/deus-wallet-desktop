/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/order
import './utils/walletConnectV2SdkShims';

import { CrossEventEmitter } from '@deusfe/cross-inpage-provider-core';
import { getSdkError } from '@walletconnect-v2/utils';

import { backgroundMethod } from '@deushq/shared/src/background/backgroundDecorators';
import { waitForDataLoaded } from '@deushq/shared/src/background/backgroundUtils';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import { refreshConnectedSites } from '../../store/reducers/refresher';

import { DeusWalletConnector } from './DeusWalletConnector';
import {
  WALLET_CONNECT_BRIDGE,
  WALLET_CONNECT_CONNECTION_TIMEOUT,
} from './walletConnectConsts';

import type { IWalletConnectRequestOptions, WalletService } from './types';
import type { WalletConnectSessionStorage } from './WalletConnectSessionStorage';
import type { IJsonRpcRequest } from '@deusfe/cross-inpage-provider-types';
import type { ICore, SessionTypes } from '@walletconnect-v2/types';
import type { IWeb3Wallet } from '@walletconnect-v2/web3wallet';
import type {
  IClientMeta,
  IWalletConnectOptions,
  IWalletConnectSession,
} from '@walletconnect/types';

// Same to
//  class DeusWalletConnect extends Connector {
export type IWalletConnectClientEventDestroy = {
  connector?: DeusWalletConnector;
};
export type IWalletConnectClientEventRpc = {
  connector?: DeusWalletConnector;
  error?: Error | null;
  payload?: IJsonRpcRequest;
};
export type IWalletConnectClientOptions = {
  sessionStorage: WalletConnectSessionStorage;
  clientMeta: IClientMeta;
};
export class WalletConnectClientBase extends CrossEventEmitter {
  constructor(options: IWalletConnectClientOptions) {
    super();
    const { sessionStorage, clientMeta } = options;
    this.sessionStorage = sessionStorage;
    this.clientMeta = clientMeta;
  }

  isWalletSide = true;

  // node_modules/@walletconnect/utils/dist/esm/constants.js
  EVENT_NAMES = {
    destroy: 'destroy',
    call_request: 'call_request',
    call_request_sent: 'call_request_sent',
    session_update: 'session_update',
    session_request: 'session_request',
    connect: 'connect',
    disconnect: 'disconnect',
    error: 'error',
    transport_error: 'transport_error',
    transport_open: 'transport_open',
    modal_closed: 'modal_closed',
  };

  sessionStorage!: WalletConnectSessionStorage;

  clientMeta!: IClientMeta;

  connector?: DeusWalletConnector | null = null; // v1 client

  web3walletV2?: IWeb3Wallet; // v2 client

  web3walletV2Core?: ICore; // v2 client core

  walletService?: WalletService;

  async waitConnectorPeerReady({
    connector,
    logName,
    timeout,
  }: {
    connector: DeusWalletConnector;
    logName: string;
    timeout: number;
  }) {
    if (!this.isWalletSide) {
      return;
    }
    // on("session_request") peerMeta peerId ready
    // needs to wait for this.connector.peerId ready
    await waitForDataLoaded({
      data: () => Boolean(connector?.peerId),
      logName,
      timeout,
    });
  }

  async _destroyConnector(connector?: DeusWalletConnector | null) {
    if (connector) {
      debugLogger.walletConnect.info(
        'try to disconnect prev connection...',
        connector.peerMeta,
      );

      this.unregisterEvents(connector);

      if (connector.connected) {
        await this.waitConnectorPeerReady({
          connector,
          logName: 'waitConnectorPeerReady -> disconnect()',
          timeout: 3 * 1000, // timeout 3s
        });
        // needs connected to call killSession
        //    Error: Missing or invalid topic field
        await connector.killSession(); // trigger `disconnect`
      }
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      connector._handleSessionDisconnect(); // trigger `disconnect`

      const eventInfo: IWalletConnectClientEventDestroy = {
        connector,
      };
      this.emit(this.EVENT_NAMES.destroy, eventInfo);
    }
  }

  async createConnector(
    connectorOpts: IWalletConnectOptions,
    config: {
      shouldDisconnectStorageSession?: boolean;
      isDeepLink?: boolean;
    } = {},
  ) {
    const { shouldDisconnectStorageSession, isDeepLink } = config;
    if (shouldDisconnectStorageSession) {
      await this.disconnect();
    }

    this.unregisterEvents(this.connector);

    // node_modules/@walletconnect/core/dist/esm/url.js will generate random bridge url
    connectorOpts.bridge = connectorOpts.bridge || WALLET_CONNECT_BRIDGE;
    // establish new ws transport here
    // subscribe (_subscribeToSessionRequest) on new DeusWalletConnector()
    const connector = new DeusWalletConnector(this.sessionStorage, {
      clientMeta: this.clientMeta,
      isWalletSide: this.isWalletSide,
      ...connectorOpts,
      isDeepLink,
    });

    // @ts-ignore
    // should reassign clientMeta here
    // connector._clientMeta = this.clientMeta;
    this.connector = connector;
    await this.setupConnector(connector);
    return connector;
  }

  // TODO pass session object
  // TODO session expired or damaged
  // TODO disconnect 3 days ago sessions
  async autoConnectLastSession(
    options: {
      session?: IWalletConnectSession | null;
      walletService?: WalletService;
    } = {},
  ) {
    let { session } = options;
    if (!session) {
      session = await this.sessionStorage.getSession();
    }

    // connector with same session already created.
    // if (this.connector?.session.key === session?.key) {
    //   return;
    // }

    if (session) {
      await this.createConnector(
        {
          session,
        },
        {
          shouldDisconnectStorageSession: false,
        },
      );
    }
  }

  async setupConnector(connector?: DeusWalletConnector) {
    if (!connector) {
      return;
    }

    // DO NOT unregisterEvents here, may cause ws connection fail
    //        connector may have registered some internal handlers at new WalletConnect()
    // this.unregisterEvents(connector);
    this.registerEvents(connector);

    // TODO subscribe may register multiple times
    // not working
    connector.on(this.EVENT_NAMES.transport_open, () => {
      connector.socketTransport?.subscribe(`${connector.clientId}`);
    });
    setTimeout(() => {
      connector.socketTransport?.subscribe(`${connector.clientId}`);
    }, 600);
    setTimeout(() => {
      connector.socketTransport?.subscribe(`${connector.clientId}`);
    }, 1500);

    // TODO use once('session_request') trigger means peer ready
    await this.waitConnectorPeerReady({
      connector,
      logName: 'waitConnectorPeerReady -> connect()',
      timeout: WALLET_CONNECT_CONNECTION_TIMEOUT, //  timeout 10s
    });

    if (!connector.connected) {
      // return session id? and save to storage?
      await connector.createSession();
      // create new connection connector.uri
    }

    // TODO save connector.session to redux for UI auto refresh
  }

  isRequestOptionsV2(options: IWalletConnectRequestOptions) {
    return Boolean(
      options.proposal || options.sessionRequest || options.sessionV2,
    );
  }

  // TODO rename to getPeerClientOrigin
  getConnectorOrigin(options: IWalletConnectRequestOptions) {
    if (this.isRequestOptionsV2(options)) {
      return this.getConnectorOriginV2(options);
    }
    const origin = options?.connector?.peerMeta?.url || '';
    return origin;
  }

  getConnectorOriginV2(options: IWalletConnectRequestOptions) {
    const origin =
      options?.sessionV2?.peer?.metadata?.url ||
      options?.proposal?.params?.proposer?.metadata?.url ||
      options?.sessionRequest?.context?.verified?.origin ||
      '';
    // return '';
    return origin;
  }

  // disconnect current memory session and storage session
  @backgroundMethod()
  async disconnect() {
    // TODO remove approved connection of address/origin
    //    backgroundApiProxy.dispatch(dappClearSiteConnection());
    await this._destroyConnector(this.connector);
    this.connector = undefined;
    this.walletService = undefined;

    const session = await this.sessionStorage.getSession();
    if (session) {
      const lastConnector = new DeusWalletConnector(this.sessionStorage, {
        session,
        isWalletSide: this.isWalletSide,
      });
      await this._destroyConnector(lastConnector);
    }
  }

  addEventListener(
    connector: DeusWalletConnector,
    eventName: string,
    handler?: (remoteError: Error | null, payload: IJsonRpcRequest) => any,
    {
      throwError = true,
    }: {
      throwError?: boolean;
    } = {},
  ) {
    connector.on(
      eventName,
      (remoteError: Error | null, payload: IJsonRpcRequest): any => {
        debugLogger.walletConnect.info(
          'EVENT',
          eventName,
          payload,
          remoteError,
        );

        const eventInfo: IWalletConnectClientEventRpc = {
          connector,
          error: remoteError,
          payload,
        };
        this.emit(eventName, eventInfo);

        if (remoteError && throwError) {
          throw remoteError;
        }
        handler?.(remoteError, payload);
      },
    );
  }

  unregisterEvents(connector?: DeusWalletConnector | null) {
    if (!connector) {
      return;
    }
    debugLogger.walletConnect.info('unregisterEvents >>>>>> ');
    // https://docs.walletconnect.com/client-api#register-event-subscription
    Object.values(this.EVENT_NAMES).forEach((event) => connector.off(event));
  }

  registerEvents(connector?: DeusWalletConnector) {
    if (!connector) {
      return;
    }

    // TODO event emit debounce
    this.addEventListener(
      connector,
      this.EVENT_NAMES.session_request,
      (error, payload: IJsonRpcRequest) => {
        const { peerMeta } = (payload.params as any[])?.[0] || {};
        debugLogger.walletConnect.info(
          'session_request >>> peerMeta',
          peerMeta,
        );
      },
    );

    // only fired on Dapp side
    this.addEventListener(connector, this.EVENT_NAMES.session_update);

    this.addEventListener(
      connector,
      this.EVENT_NAMES.call_request,
      (error, payload) => {
        // https://docs.walletconnect.com/client-api#send-custom-request
        // await window.$connector.sendCustomRequest({method:'eth_gasPrice'})
      },
    );

    this.addEventListener(
      connector,
      this.EVENT_NAMES.call_request_sent,
      () => {},
    );

    // trigger when accounts approveSession()
    this.addEventListener(connector, this.EVENT_NAMES.connect);

    // disconnect from dapp or wallet will auto remove storage
    this.addEventListener(
      connector,
      this.EVENT_NAMES.disconnect,
      (error, payload) => {
        this.disconnect();
      },
    );

    this.addEventListener(connector, this.EVENT_NAMES.modal_closed, () => {
      if (!this.connector?.connected) {
        // Native modal will emit `modal_closed` after connected
        this.disconnect();
        // const transport = this.connector._transport as SocketTransport
        // transport.closed
        // this.connector?.transportClose();
      }
    });

    this.addEventListener(connector, this.EVENT_NAMES.error);
    this.addEventListener(connector, this.EVENT_NAMES.transport_error);
    this.addEventListener(connector, this.EVENT_NAMES.transport_open);
  }
}

export class WalletConnectContextProvider {}

export class ProviderApiWalletConnect {}
