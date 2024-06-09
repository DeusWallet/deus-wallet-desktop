import { useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import { Box, Image, Modal, Typography, VStack } from '@deushq/components';
import Pressable from '@deushq/components/src/Pressable/Pressable';

import type { StakingRoutes, StakingRoutesParams } from '../typing';
import type { RouteProp } from '@react-navigation/core';

type RouteProps = RouteProp<
  StakingRoutesParams,
  StakingRoutes.LidoEthUnstakeRoutes
>;

const LidoEthUnstakeRoutes = () => {
  const intl = useIntl();
  const route = useRoute<RouteProps>();
  const { source, onSelector } = route.params;

  return (
    <Modal footer={null} header={intl.formatMessage({ id: 'form__route' })}>
      <VStack space="4">
        <Pressable
          flexDirection="row"
          py="3"
          px="2"
          alignItems="center"
          justifyContent="space-between"
          bg={source === 'lido' ? 'surface-selected' : 'background-default'}
          borderRadius={12}
          onPress={() => onSelector?.('lido')}
        >
          <Box flexDirection="row" alignItems="center">
            <Image
              w="10"
              h="10"
              mr="3"
              source={require('@deushq/kit/assets/staking/lido_pool.png')}
            />
            <Box flexDirection="column" justifyContent="space-between">
              <Typography.Body1Strong>Lido</Typography.Body1Strong>
              <Typography.Body2 color="text-subdued">
                {intl
                  .formatMessage({ id: 'form__str_day' }, { '0': '~ 1 - 3' })
                  .toLowerCase()}
              </Typography.Body2>
            </Box>
          </Box>
        </Pressable>
        <Pressable
          flexDirection="row"
          py="3"
          px="2"
          alignItems="center"
          justifyContent="space-between"
          bg={source === 'deus' ? 'surface-selected' : 'background-default'}
          borderRadius={12}
          onPress={() => onSelector?.('deus')}
        >
          <Box flexDirection="row" alignItems="center">
            <Image
              w="10"
              h="10"
              mr="3"
              source={require('@deushq/kit/assets/logo_black.png')}
            />
            <Box flexDirection="column" justifyContent="space-between">
              <Typography.Body1Strong>Deus Swap</Typography.Body1Strong>
              <Typography.Body2 color="text-subdued">
                {intl.formatMessage(
                  { id: 'content__str_minutes_plural' },
                  { '0': '~ 1-5' },
                )}
              </Typography.Body2>
            </Box>
          </Box>
        </Pressable>
      </VStack>
    </Modal>
  );
};
export default LidoEthUnstakeRoutes;
