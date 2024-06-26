import type { FC } from 'react';

import { useIntl } from 'react-intl';

import { Box, Icon, Typography } from '@deushq/components';

import { calculateGains } from '../../../utils/priceUtils';

type SwapPriceLabelProps = {
  price: number | null;
  basePrice: number;
  time: string;
};

const PriceDisplayInfo: FC<SwapPriceLabelProps> = ({
  price,
  basePrice,
  time,
}) => {
  const intl = useIntl();
  let displayInfo;
  if (price !== null) {
    const { gainText, percentageGain, gainTextColor } = calculateGains({
      basePrice,
      price,
    });
    displayInfo = (
      <>
        <Typography.Body2Strong color={gainTextColor}>
          {gainText}({percentageGain})
        </Typography.Body2Strong>
        <Typography.Body2Strong color="text-subdued" ml="8px">
          {time}
        </Typography.Body2Strong>
      </>
    );
  } else {
    displayInfo = (
      <>
        <Icon name="ExclamationTriangleMini" size={16} />
        <Typography.Body2Strong color="text-subdued" ml="8px">
          {intl.formatMessage({
            id: 'content__data_for_this_token_is_not_included_yet',
          })}
        </Typography.Body2Strong>
      </>
    );
  }
  // const { selectedFiatMoneySymbol } = useSettings();
  return (
    <Box flexDirection="column">
      <Box flexDirection="row" alignItems="center">
        {displayInfo}
      </Box>
    </Box>
  );
};

PriceDisplayInfo.displayName = 'PriceDisplayInfo';
export default PriceDisplayInfo;
