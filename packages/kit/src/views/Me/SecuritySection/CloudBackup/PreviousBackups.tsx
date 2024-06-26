import type { FC } from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';

import { useIntl } from 'react-intl';
import { StyleSheet } from 'react-native';

import { Box, Center, Spinner, Text } from '@deushq/components';
import type { IBackupItemSummary } from '@deushq/shared/src/services/ServiceCloudBackup/ServiceCloudBackup.types';

import backgroundApiProxy from '../../../../background/instance/backgroundApiProxy';
import { useNavigation } from '../../../../hooks';
import { HomeRoutes } from '../../../../routes/routesEnum';

import BackupSummary from './BackupSummary';
import Wrapper from './Wrapper';

import type { RootRoutes } from '../../../../routes/routesEnum';
import type {
  HomeRoutesParams,
  RootRoutesParams,
} from '../../../../routes/types';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<RootRoutesParams, RootRoutes.Main>,
  NativeStackNavigationProp<HomeRoutesParams, HomeRoutes.CloudBackupDetails>
>;

const PressableBackupSummary: FC<Omit<IBackupItemSummary, 'deviceInfo'>> = ({
  backupUUID,
  backupTime,
  numOfHDWallets,
  numOfAccounts,
}) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <BackupSummary
      onPress={() => {
        navigation.navigate(HomeRoutes.CloudBackupDetails, {
          backupUUID,
          backupTime,
          numOfHDWallets,
          numOfAccounts,
        });
      }}
      backupTime={backupTime}
      numOfHDWallets={numOfHDWallets}
      numOfAccounts={numOfAccounts}
      size="normal"
    />
  );
};

const CloudBackup = () => {
  const intl = useIntl();
  const navigation = useNavigation();
  const { serviceCloudBackup } = backgroundApiProxy;

  useLayoutEffect(() => {
    const title = intl.formatMessage({ id: 'content__previous_backups' });
    navigation.setOptions({
      title,
    });
  }, [navigation, intl]);

  const [loading, setLoading] = useState(true);
  const [previousBackups, setPreviousBackups] = useState<
    Array<Array<IBackupItemSummary>>
  >([]);

  useEffect(() => {
    const getPreviousBackups = async () => {
      setPreviousBackups(await serviceCloudBackup.getPreviousBackups());
      setLoading(false);
    };
    getPreviousBackups();
  }, [serviceCloudBackup]);

  return (
    <Wrapper>
      {loading ? (
        <Center py={16}>
          <Spinner size="lg" />
        </Center>
      ) : (
        <>
          {previousBackups.map((group, index) => (
            <Box key={index}>
              {index !== 0 ? (
                <Box
                  borderBottomWidth={StyleSheet.hairlineWidth}
                  borderBottomColor="divider"
                  my={6}
                  bgColor="divider"
                />
              ) : null}
              <Text typography="Body2Strong" color="text-subdued">
                {group[0].deviceInfo.deviceName}
              </Text>
              <Box>
                {group.map((item) => (
                  <PressableBackupSummary key={item.backupUUID} {...item} />
                ))}
              </Box>
            </Box>
          ))}
        </>
      )}
    </Wrapper>
  );
};

export default CloudBackup;
