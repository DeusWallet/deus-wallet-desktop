import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useNavigation, useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';
import { Platform } from 'react-native';

import type { NfcConnectUiState } from '@deushq/app/src/hardware/DeusLite';
import DeusLite from '@deushq/app/src/hardware/DeusLite';
import type {
  CallbackError,
  CardInfo,
} from '@deushq/app/src/hardware/DeusLite/types';
import { ToastManager } from '@deushq/components';
import type { ButtonType } from '@deushq/components/src/Button';
import backgroundApiProxy from '@deushq/kit/src/background/instance/backgroundApiProxy';
import type { CreateWalletRoutesParams } from '@deushq/kit/src/routes';
import { CreateWalletModalRoutes } from '@deushq/kit/src/routes/routesEnum';
import type { ModalScreenProps } from '@deushq/kit/src/routes/types';
import { updateWallet } from '@deushq/kit/src/store/reducers/runtime';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import { SkipAppLock } from '../../../../components/AppLock';
import HardwareConnect from '../../BaseConnect';
import ErrorDialog from '../ErrorDialog';

import type { OperateType } from '../../BaseConnect';
import type { RouteProp } from '@react-navigation/core';

type RouteProps = RouteProp<
  CreateWalletRoutesParams,
  CreateWalletModalRoutes.DeusLiteBackupModal
>;

type NavigationProps = ModalScreenProps<CreateWalletRoutesParams>;

const Backup: FC = () => {
  const intl = useIntl();

  const navigation = useNavigation<NavigationProps['navigation']>();
  const { dispatch } = backgroundApiProxy;
  const { walletId, pinCode, backupData, onSuccess } =
    useRoute<RouteProps>().params;

  const [pinRetryCount, setPinRetryCount] = useState('');
  const [title] = useState(
    intl.formatMessage({ id: 'app__hardware_name_deus_lite' }),
  );
  const [actionPressStyle, setActionPressStyle] =
    useState<ButtonType>('primary');
  const [actionPressContent, setActionPressContent] = useState(
    intl.formatMessage({ id: 'action__connect' }),
  );
  const [actionState, setActionState] = useState(
    intl.formatMessage({ id: 'title__place_your_card_as_shown_below' }),
  );
  const [actionDescription, setActionDescription] = useState(
    intl.formatMessage({ id: 'title__place_your_card_as_shown_below_desc' }),
  );
  const [operateType, setOperateType] = useState<OperateType>('guide');
  const [errorCode, setErrorCode] = useState(0);

  const goBack = () => {
    const inst = navigation.getParent() || navigation;
    inst.goBack();
  };

  const stateNfcSearch = () => {
    setActionPressStyle('basic');
    setActionPressContent(intl.formatMessage({ id: 'action__cancel' }));
    setActionState(intl.formatMessage({ id: 'title__searching' }));
    setActionDescription(intl.formatMessage({ id: 'title__searching_desc' }));
    setOperateType('connect');
  };

  const stateNfcTransfer = () => {
    setActionPressStyle('basic');
    setActionPressContent(intl.formatMessage({ id: 'action__cancel' }));
    setActionState(intl.formatMessage({ id: 'title__transferring_data' }));
    setActionDescription(
      intl.formatMessage({ id: 'title__transferring_data_desc' }),
    );
    setOperateType('transfer');
  };

  const stateNfcComplete = () => {
    setActionPressStyle('primary');
    setActionPressContent(intl.formatMessage({ id: 'action__i_got_it' }));
    setActionState(intl.formatMessage({ id: 'title__backup_completed' }));
    setActionDescription(
      intl.formatMessage({
        id: 'title__backup_completed_desc',
      }),
    );
    setOperateType('complete');
  };

  const startNfcScan = (overwrite = false) => {
    if (backupData.trim() === '') {
      ToastManager.show({
        title: intl.formatMessage({ id: 'msg__unknown_error' }),
      });
      navigation.goBack();
      return;
    }

    stateNfcSearch();
    DeusLite.cancel();
    DeusLite.setMnemonic(
      backupData,
      pinCode,
      async (error: CallbackError, data: boolean | null, state: CardInfo) => {
        console.log('state', state);
        if (data) {
          debugLogger.deusLite.debug('NFC read success:', data, state);
          console.log('NFC read data:', data);
          stateNfcComplete();
          if (walletId) {
            const wallet =
              await backgroundApiProxy.engine.confirmHDWalletBackuped(walletId);
            if (!wallet || wallet?.backuped === false) return;

            dispatch(updateWallet(wallet));
          }
          onSuccess?.();
        } else if (error) {
          debugLogger.deusLite.debug(
            'NFC read error code',
            error.code,
            error.message,
            state,
          );
          setPinRetryCount(state?.pinRetryCount?.toString() ?? '0');
          setErrorCode(error.code);
        }
      },
      overwrite,
    );
  };

  const handleCloseConnect = () => {
    console.log('handleCloseConnect');
  };

  const handleActionPress = () => {
    switch (operateType) {
      case 'guide':
        startNfcScan();
        break;
      case 'connect':
      case 'transfer':
        if (Platform.OS === 'ios') return;
        DeusLite.cancel();
        goBack();
        break;

      default:
        goBack();
        break;
    }
  };

  const handlerNfcConnectState = (event: NfcConnectUiState) => {
    debugLogger.deusLite.debug(
      'Deus Lite Reset handler NfcConnectState',
      event,
    );

    switch (event.code) {
      case 1:
        break;
      case 2:
        stateNfcTransfer();
        break;
      case 3:
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    DeusLite.addConnectListener(handlerNfcConnectState);

    if (Platform.OS !== 'ios') {
      startNfcScan();
    }

    return () => {
      DeusLite.removeConnectListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SkipAppLock />
      <HardwareConnect
        title={title}
        connectType="ble"
        actionState={actionState}
        actionDescription={actionDescription}
        operateType={operateType}
        onCloseConnect={handleCloseConnect}
        onActionPress={handleActionPress}
        actionPressStyle={actionPressStyle}
        actionPressContent={actionPressContent}
      />
      <ErrorDialog
        code={errorCode}
        pinRetryCount={pinRetryCount}
        onRetry={() =>
          navigation.replace(
            CreateWalletModalRoutes.DeusLiteBackupPinCodeVerifyModal,
            {
              walletId,
              backupData,
              onSuccess,
            },
          )
        }
        onRetryConnect={() => {
          startNfcScan(true);
        }}
        onExit={() => {
          goBack();
        }}
        onIntoNfcSetting={() => {
          DeusLite.intoSetting();
          goBack();
        }}
        onDialogClose={() => setErrorCode(0)}
      />
    </>
  );
};

export default Backup;
