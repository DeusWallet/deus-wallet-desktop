import { useEffect } from 'react';

import { useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import {
  Badge,
  Box,
  HStack,
  Modal,
  Typography,
  VStack,
} from '@deushq/components';
import Pressable from '@deushq/components/src/Pressable/Pressable';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { useKeleDashboardInfo } from '../hooks';
import { KeleStakingMode } from '../typing';

import type { StakingRoutes, StakingRoutesParams } from '../typing';
import type { RouteProp } from '@react-navigation/core';

type RouteProps = RouteProp<
  StakingRoutesParams,
  StakingRoutes.KeleStakingModeSelector
>;

const KeleStakingModeSelector = () => {
  const intl = useIntl();
  const route = useRoute<RouteProps>();
  const { networkId, mode, onSelector } = route.params;
  const keleDashboardInfo = useKeleDashboardInfo(networkId);
  const hours = Number(
    keleDashboardInfo?.validator_alive_predicted_hour ?? '24',
  );
  const text =
    hours > 24
      ? intl.formatMessage(
          { id: 'form__str_day' },
          { '0': Math.ceil(hours / 24) },
        )
      : intl.formatMessage({ id: 'form__str_hours' }, { '0': hours });

  useEffect(() => {
    if (!keleDashboardInfo) {
      backgroundApiProxy.serviceStaking.getDashboardGlobal({ networkId });
    }
    //  eslint-disable-next-line
  }, [])

  return (
    <Modal header={intl.formatMessage({ id: 'content__mode' })} footer={null}>
      <VStack space={1}>
        <Pressable
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          borderRadius={8}
          p="2"
          bgColor={
            mode === KeleStakingMode.normal ? 'surface-selected' : undefined
          }
          onPress={() => onSelector?.(KeleStakingMode.normal)}
        >
          <Box flexDirection="row" alignItems="center">
            <HStack space={1}>
              <Typography.Body1Strong>🚕</Typography.Body1Strong>
              <Typography.Body1Strong>
                {intl.formatMessage({ id: 'content__normal' })}
              </Typography.Body1Strong>
            </HStack>
          </Box>
          <Box alignItems="flex-end">
            <Typography.Body2Strong>~ {text}</Typography.Body2Strong>
            <Typography.Body2Strong>
              {intl.formatMessage({ id: 'content__estimated_time' })}
            </Typography.Body2Strong>
          </Box>
        </Pressable>
        <Pressable
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          borderRadius={8}
          p="2"
          bgColor={
            mode === KeleStakingMode.fast ? 'surface-selected' : undefined
          }
          onPress={() => onSelector?.(KeleStakingMode.fast)}
        >
          <Box flexDirection="row" alignItems="center">
            <HStack space={1}>
              <Typography.Body1Strong>🚅</Typography.Body1Strong>
              <Typography.Body1Strong>
                {intl.formatMessage({ id: 'content__fast' })}
              </Typography.Body1Strong>
              <Badge
                type="info"
                title={intl.formatMessage(
                  { id: 'content__str_faster' },
                  { '0': '99.99%' },
                )}
                size="sm"
              />
            </HStack>
          </Box>
          <Box alignItems="flex-end">
            <Typography.Body2Strong>
              ~ {intl.formatMessage({ id: 'form__str_minutes' }, { '0': '30' })}
            </Typography.Body2Strong>
            <Typography.Body2Strong>
              {intl.formatMessage({ id: 'content__estimated_time' })}
            </Typography.Body2Strong>
          </Box>
        </Pressable>
      </VStack>
    </Modal>
  );
};

export default KeleStakingModeSelector;
