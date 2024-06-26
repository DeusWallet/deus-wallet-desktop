import { useCallback, useEffect } from 'react';

import LayoutHeader from './index';

import { Box, HStack, IconButton } from '@deushq/components';
import { NetworkAccountSelectorTriggerDesktop } from '@deushq/kit/src/components/NetworkAccountSelector';
import { useCheckUpdate } from '@deushq/kit/src/hooks/useCheckUpdate';
import HomeMoreMenu from '@deushq/kit/src/views/Overlay/HomeMoreMenu';
import debugLogger from '@deushq/shared/src/logger/debugLogger';

import type { MessageDescriptor } from 'react-intl';

export function LayoutHeaderDesktop({
  i18nTitle,
}: {
  i18nTitle?: MessageDescriptor['id'];
}) {
  const { showUpdateBadge } = useCheckUpdate();

  useEffect(() => {
    debugLogger.autoUpdate.debug(
      'LayoutHeaderDesktop showUpdateBadge effect: ',
      showUpdateBadge,
    );
  }, [showUpdateBadge]);

  const headerRight = useCallback(
    () => (
      <HStack space={2} alignItems="center">
        <NetworkAccountSelectorTriggerDesktop allowSelectAllNetworks />
        <Box>
          <HomeMoreMenu>
            <IconButton
              name="EllipsisVerticalOutline"
              size="lg"
              type="plain"
              circle
              m={-2}
            />
          </HomeMoreMenu>
          {showUpdateBadge && (
            <Box
              position="absolute"
              top="-3px"
              right="-8px"
              rounded="full"
              p="2px"
              pr="9px"
            >
              <Box rounded="full" bgColor="interactive-default" size="8px" />
            </Box>
          )}
        </Box>
      </HStack>
    ),
    [showUpdateBadge],
  );

  return (
    <LayoutHeader
      testID="App-Layout-Header-Desktop"
      showOnDesktop
      // headerLeft={() => <AccountSelector />}
      // headerLeft={() => null}
      i18nTitle={i18nTitle}
      // headerRight={() => <ChainSelector />}
      // headerRight={() => <NetworkAccountSelectorTrigger />}
      headerRight={headerRight}
    />
  );
}
