import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/core';
import { useIntl } from 'react-intl';
import { Platform } from 'react-native';

import type { NfcConnectUiState } from '@deushq/app/src/hardware/DeusLite';
import DeusLite from '@deushq/app/src/hardware/DeusLite';
import type {
  CallbackError,
  CardInfo,
} from '@deushq/app/src/hardware/DeusLite/types';
import type { ButtonType } from '@deushq/components/src/Button';
import type { DeusLiteResetRoutesParams } from '@deushq/kit/src/routes';
import type { ModalScreenProps } from '@deushq/kit/src/routes/types';

import { SkipAppLock } from '../../../../components/AppLock';
import HardwareConnect from '../../BaseConnect';
import ErrorDialog from '../ErrorDialog';

import type { OperateType } from '../../BaseConnect';

type NavigationProps = ModalScreenProps<DeusLiteResetRoutesParams>;

const Reset: FC = () => {
  const intl = useIntl();
  const navigation = useNavigation<NavigationProps['navigation']>();

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
    setActionState(
      intl.formatMessage({ id: 'title__the_device_has_been_reset' }),
    );
    setActionDescription(
      intl.formatMessage({
        id: 'content__you_can_use_it_as_a_new_deus_lite',
      }),
    );
    setOperateType('complete');
  };

  const startNfcScan = () => {
    stateNfcSearch();
    DeusLite.cancel();
    DeusLite.reset(
      (error: CallbackError, data: boolean | null, state: CardInfo) => {
        console.log('state', state);
        if (data) {
          console.log('NFC read data:', data);
          stateNfcComplete();
        } else if (error) {
          console.log('NFC read error', error);

          console.log('NFC read error code', error.code, error.message);
          setErrorCode(error.code);
        }
      },
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
    console.log('Deus Lite Reset handler NfcConnectState', event);

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
        onRetryConnect={startNfcScan}
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

export default Reset;
