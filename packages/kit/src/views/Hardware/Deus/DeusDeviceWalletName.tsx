import type { FC } from 'react';
import { memo, useEffect, useMemo, useState } from 'react';

import { useRoute } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { useIntl } from 'react-intl';

import {
  Box,
  Button,
  Center,
  Form,
  KeyboardDismissView,
  Modal,
  ToastManager,
  useForm,
} from '@deushq/components';
import backgroundApiProxy from '@deushq/kit/src/background/instance/backgroundApiProxy';
import WalletAvatar from '@deushq/kit/src/components/WalletSelector/WalletAvatar';
import type { DeusHardwareRoutesParams } from '@deushq/kit/src/routes/Root/Modal/HardwareDeus';
import { deviceUtils } from '@deushq/kit/src/utils/hardware';

import type { DeusHardwareModalRoutes } from '../../../routes/routesEnum';
import type { RouteProp } from '@react-navigation/core';

type FieldValues = { name: string };

type RouteProps = RouteProp<
  DeusHardwareRoutesParams,
  DeusHardwareModalRoutes.DeusHardwareDeviceNameModal
>;

type DeviceNameProps = {
  walletId: string;
};

const DeusDeviceWalletName: FC<DeviceNameProps> = ({ walletId }) => {
  const intl = useIntl();
  const { engine, serviceAccount } = backgroundApiProxy;

  const navigation = useNavigation();
  const { control, handleSubmit, setError, setValue } = useForm<FieldValues>({
    defaultValues: {
      name: '',
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setWalletName = async () => {
      const wallet = await engine.getWallet(walletId);
      setValue('name', wallet.name);
    };
    setWalletName();
  }, [engine, setValue, walletId]);

  const onSubmit = handleSubmit(async (values: FieldValues) => {
    setLoading(true);
    try {
      const label = values.name;
      await engine.updateWalletName(walletId, label);

      /**
       * use dispatch action to refresh the wallet list
       */
      await serviceAccount.initWallets();
      ToastManager.show({
        title: intl.formatMessage({ id: 'msg__change_saved' }),
      });
      navigation.getParent()?.goBack();
    } catch (e) {
      const error = deviceUtils.convertDeviceError(e);
      setError('name', {
        message: intl.formatMessage({ id: error.key ?? 'msg__unknown_error' }),
      });
    } finally {
      setLoading(false);
    }
  });

  const ImageView = useMemo(
    () => (
      <Center>
        <Box width="56px" height="56px">
          <WalletAvatar walletImage="hw" isPassphrase size="xl" />
        </Box>
      </Center>
    ),
    [],
  );

  return (
    <KeyboardDismissView px={{ base: 4, md: 6 }}>
      {ImageView}
      <Form mt="3" mb="2">
        <Form.Item
          name="name"
          control={control}
          rules={{
            maxLength: {
              value: 16,
              message: intl.formatMessage({
                id: 'msg__exceeding_the_maximum_word_limit',
              }),
            },
          }}
        >
          <Form.Input size="xl" autoFocus />
        </Form.Item>
      </Form>
      <Button
        mt="6"
        type="primary"
        size="xl"
        isLoading={loading}
        onPress={onSubmit}
      >
        {intl.formatMessage({
          id: 'action__done',
        })}
      </Button>
    </KeyboardDismissView>
  );
};

const DeusDeviceWalletNameModal: FC = () => {
  const intl = useIntl();
  const route = useRoute<RouteProps>();
  const { walletId } = route?.params || {};

  return (
    <Modal
      header={intl.formatMessage({ id: 'modal__edit_wallet' })}
      footer={null}
      scrollViewProps={{
        contentContainerStyle: {
          flex: 1,
          justifyContent: 'center',
          paddingTop: 24,
          paddingBottom: 24,
        },
        children: <DeusDeviceWalletName walletId={walletId} />,
      }}
    />
  );
};

export default memo(DeusDeviceWalletNameModal);
