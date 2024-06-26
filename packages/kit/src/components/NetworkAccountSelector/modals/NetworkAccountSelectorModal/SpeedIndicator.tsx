import type { ComponentProps } from 'react';

import { Box } from '@deushq/components';
import type { ThemeToken } from '@deushq/components/src/Provider/theme';

type Props = {
  backgroundColor: ThemeToken;
} & ComponentProps<typeof Box>;

const Speedindicator = (props: Props) => (
  <Box
    size="8px"
    borderRadius="full"
    borderWidth="2px"
    borderColor="background-default"
    {...props}
  />
);

export default Speedindicator;
