import type { FC } from 'react';
import { useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Box, Icon, Text } from '@deushq/components';
import PressableItem from '@deushq/components/src/Pressable/PressableItem';
import { formatMessage } from '@deushq/components/src/Provider';
import backgroundApiProxy from '@deushq/kit/src/background/instance/backgroundApiProxy';
import { useAppSelector } from '@deushq/kit/src/hooks/redux';

import { showOverlay } from '../../utils/overlayUtils';

import { OverlayPanel } from './OverlayPanel';

import type { MessageDescriptor } from 'react-intl';

const SelectNFTPriceType: FC<{ closeOverlay: () => void }> = ({
  closeOverlay,
}) => {
  const intl = useIntl();
  const disPlayPriceType = useAppSelector((s) => s.nft.disPlayPriceType);

  const { serviceNFT } = backgroundApiProxy;

  const options: {
    id: MessageDescriptor['id'];
    selected: boolean;
  }[] = useMemo(
    () => [
      {
        id: 'form__last_price',
        selected: disPlayPriceType === 'lastSalePrice',
      },
      {
        id: 'form__floor_price',
        selected: disPlayPriceType === 'floorPrice',
      },
    ],
    [disPlayPriceType],
  );
  return (
    <Box bg="surface-subdued" flexDirection="column">
      {options.filter(Boolean).map(({ id, selected }) => (
        <PressableItem
          key={id}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          py={{ base: '12px', sm: '8px' }}
          px={{ base: '16px', sm: '8px' }}
          bg="transparent"
          borderRadius="12px"
          onPress={() => {
            closeOverlay();
            serviceNFT.updatePriceType(
              id === 'form__last_price' ? 'lastSalePrice' : 'floorPrice',
            );
          }}
        >
          <Text typography="Body1Strong" ml="16px">
            {intl.formatMessage({
              id,
            })}
          </Text>
          {selected && <Icon name="CheckOutline" color="interactive-default" />}
        </PressableItem>
      ))}
    </Box>
  );
};

export const showSelectNFTPriceType = () =>
  showOverlay((closeOverlay) => (
    <OverlayPanel
      closeOverlay={closeOverlay}
      modalProps={{
        header: formatMessage({ id: 'action__more' }),
      }}
    >
      <SelectNFTPriceType closeOverlay={closeOverlay} />
    </OverlayPanel>
  ));
