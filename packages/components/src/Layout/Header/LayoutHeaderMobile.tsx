import LayoutHeader from './index';

import { HStack, IconButton } from '@deushq/components';
import { NetworkAccountSelectorTriggerMobile } from '@deushq/kit/src/components/NetworkAccountSelector';
import WalletSelectorTrigger from '@deushq/kit/src/components/WalletSelector/WalletSelectorTrigger/WalletSelectorTrigger';
import HomeMoreMenu from '@deushq/kit/src/views/Overlay/HomeMoreMenu';

const headerLeft = () => <WalletSelectorTrigger />;
const headerRight = () => (
  <HStack space={3} alignItems="center">
    <NetworkAccountSelectorTriggerMobile allowSelectAllNetworks />
    <HomeMoreMenu>
      <IconButton
        name="EllipsisVerticalOutline"
        type="plain"
        size="lg"
        circle
        m={-2}
      />
    </HomeMoreMenu>
  </HStack>
);
export function LayoutHeaderMobile() {
  return (
    <LayoutHeader
      testID="App-Layout-Header-Mobile"
      showOnDesktop={false}
      // headerLeft={() => <AccountSelector />}
      headerLeft={headerLeft}
      // headerRight={() => <ChainSelector />}
      headerRight={headerRight}
    />
  );
}
