import type { FC } from 'react';
import { memo } from 'react';

import { useIntl } from 'react-intl';

import {
  Box,
  Center,
  HStack,
  Icon,
  Pressable,
  Skeleton,
  ToastManager,
  Token,
  Typography,
} from '@deushq/components';
import type { MarketTokenItem } from '@deushq/kit/src/store/reducers/market';

import backgroundApiProxy from '../../../../background/instance/backgroundApiProxy';
import { useMarketTokenItem } from '../../hooks/useMarketToken';

const MarketSearchTokenDestopCell: FC<{
  marketTokenId: string;
  onPress: (marketTokenItem: MarketTokenItem) => void;
}> = ({ marketTokenId, onPress }) => {
  const marketTokenItem = useMarketTokenItem({
    coingeckoId: marketTokenId,
    isList: true,
  });
  const intl = useIntl();
  return (
    <Pressable
      onPress={() => {
        if (marketTokenItem && onPress) onPress(marketTokenItem);
      }}
    >
      {({ isHovered, isPressed }) => (
        <Box
          p={2}
          borderRadius="12px"
          flexDirection="row"
          alignItems="center"
          mr="1px"
          justifyContent={
            isHovered || isPressed ? 'space-between' : 'flex-start'
          }
          bgColor={isPressed || isHovered ? 'surface-selected' : undefined}
        >
          {marketTokenItem ? (
            <HStack space={3} alignItems="center" justifyContent="center">
              <Pressable
                p={1}
                flexDirection="row"
                alignItems="center"
                rounded="full"
                _hover={{ bgColor: 'surface-hovered' }}
                _pressed={{ bgColor: 'surface-pressed' }}
                onPress={() => {
                  if (marketTokenItem.favorited) {
                    backgroundApiProxy.serviceMarket.cancelMarketFavoriteToken(
                      marketTokenItem.coingeckoId,
                    );
                    ToastManager.show({
                      title: intl.formatMessage({
                        id: 'msg__removed',
                      }),
                    });
                  } else {
                    backgroundApiProxy.serviceMarket.saveMarketFavoriteTokens([
                      {
                        coingeckoId: marketTokenItem.coingeckoId,
                        symbol: marketTokenItem.symbol,
                      },
                    ]);
                    ToastManager.show({
                      title: intl.formatMessage({
                        id: 'msg__added_to_favorites',
                      }),
                    });
                  }
                }}
              >
                <Icon
                  name={marketTokenItem.favorited ? 'StarSolid' : 'StarOutline'}
                  size={20}
                  color={
                    marketTokenItem.favorited ? 'icon-warning' : 'icon-subdued'
                  }
                />
              </Pressable>
              {marketTokenItem.logoURI ? (
                <Token
                  size={8}
                  token={{
                    logoURI: marketTokenItem.logoURI,
                    symbol: marketTokenItem.symbol,
                    name: marketTokenItem.name,
                  }}
                />
              ) : (
                <Skeleton shape="Avatar" size={32} />
              )}
              <Typography.Body1Strong>
                {marketTokenItem.symbol}
              </Typography.Body1Strong>
              <Typography.Body2 color="text-subdued">
                {marketTokenItem.name}
              </Typography.Body2>
            </HStack>
          ) : (
            <HStack space={3} alignItems="center" justifyContent="center">
              <Skeleton shape="Avatar" size={32} />
              <Skeleton shape="Body2" />
              <Skeleton shape="Body2" />
            </HStack>
          )}
          {isHovered || isPressed ? (
            <Center
              bgColor="surface-neutral-subdued"
              w="32px"
              h="24px"
              borderRadius="6px"
            >
              <Icon name="ReplyMini" size={16} />
            </Center>
          ) : null}
        </Box>
      )}
    </Pressable>
  );
};

export default memo(MarketSearchTokenDestopCell);
