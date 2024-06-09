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
import { CardErrors } from '@deushq/app/src/hardware/DeusLite/types';
import type { ButtonType } from '@deushq/components/src/Button';
import type { CreateWalletRoutesParams } from '@deushq/kit/src/routes';
import { CreateWalletModalRoutes } from '@deushq/kit/src/routes/routesEnum';
import type { ModalScreenProps } from '@deushq/kit/src/routes/types';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import { SkipAppLock } from '../../../../components/AppLock';
import { useNavigationActions } from '../../../../hooks';
import HardwareConnect from '../../BaseConnect';
import ErrorDialog from '../ErrorDialog';

import type { OperateType } from '../../BaseConnect';
import type { RouteProp } from '@react-navigation/core';

type NavigationProps = ModalScreenProps<CreateWalletRoutesParams>;

type RouteProps = RouteProp<
  CreateWalletRoutesParams,
  CreateWalletModalRoutes.DeusLiteRestoreModal
>;

const Restore: FC = () => {
  const intl = useIntl();
  const { openRootHome } = useNavigationActions();
  const navigation = useNavigation<NavigationProps['navigation']>();

  const { pinCode } = useRoute<RouteProps>().params;
  const [pinRetryCount, setPinRetryCount] = useState<string>('');
  const [restoreData, setRestoreData] = useState<string>();

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

  const goBackHome = () => {
    openRootHome();

    // wait openRootHome DONE!
    setTimeout(() => {
      // openAccountSelector();
    }, 600);
    // openDrawer();
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
    setActionPressContent(intl.formatMessage({ id: 'action__continue' }));
    setActionState(intl.formatMessage({ id: 'title__nfc_data_has_been_read' }));
    setActionDescription(
      intl.formatMessage({
        id: 'title__nfc_data_has_been_read_desc',
      }),
    );
    setOperateType('complete');
  };

  const stateNfcDone = () => {
    ('primary');

    setActionPressContent(intl.formatMessage({ id: 'action__go_to_view' }));
    setActionState(intl.formatMessage({ id: 'title__recovery_completed' }));
    setActionDescription(
      intl.formatMessage({
        id: 'title__recovery_completed_desc',
      }),
    );
    setOperateType('done');
  };

  const startNfcScan = () => {
    stateNfcSearch();
    DeusLite.cancel();
    DeusLite.getMnemonicWithPin(
      pinCode,
      (error: CallbackError, data: string | null, state: CardInfo) => {
        if (data) {
          debugLogger.deusLite.debug('NFC read success, card state:', state);
          setRestoreData(data);
          stateNfcComplete();
          navigation.navigate(
            CreateWalletModalRoutes.DeusLiteRestoreDoneModal,
            {
              mnemonic: data,
              onSuccess: () => {
                stateNfcDone();
              },
            },
          );
        } else if (error) {
          debugLogger.deusLite.debug('NFC read error', error);
          setPinRetryCount(state?.pinRetryCount?.toString() ?? '0');
          setErrorCode(error.code);
        } else {
          debugLogger.deusLite.debug(
            'NFC read unknown error, card state:',
            state,
          );
          setErrorCode(CardErrors.ExecFailure);
        }
      },
    );
  };

  const handleCloseConnect = () => {
    debugLogger.deusLite.debug('handleCloseConnect');
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

      case 'complete':
        if (!restoreData) return;
        navigation.navigate(
          CreateWalletModalRoutes.DeusLiteRestoreDoneModal,
          {
            mnemonic: restoreData,
            onSuccess: () => {
              stateNfcDone();
            },
          },
        );
        break;

      case 'done':
        goBackHome();
        break;

      default:
        goBack();
        break;
    }
  };

  const handlerNfcConnectState = (event: NfcConnectUiState) => {
    debugLogger.deusLite.debug('handlerNfcConnectState', event);
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
        onRetryConnect={() => startNfcScan()}
        onRetry={() =>
          navigation.replace(
            CreateWalletModalRoutes.DeusLiteRestorePinCodeVerifyModal,
          )
        }
        onExit={() => {
          goBack();
        }}
        onDialogClose={() => setErrorCode(0)}
        onIntoNfcSetting={() => {
          DeusLite.intoSetting();
          goBack();
        }}
      />
    </>
  );
};

export default Restore;
