import { useCallback } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';

import type { Account } from '@deushq/engine/src/types/account';

import AccountSelectorModal from '../components/AccountSelectorModal';

import type { SwapRoutes, SwapRoutesParams } from '../typings';
import type { RouteProp } from '@react-navigation/native';

type RouteProps = RouteProp<SwapRoutesParams, SwapRoutes.SelectSendingAccount>;

const SelectSendingAccount = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();

  const onSelected = useCallback(
    (acc: Account) => {
      route.params?.onSelected?.(acc);
      navigation.goBack();
    },
    [route, navigation],
  );

  return (
    <AccountSelectorModal
      accountId={route.params?.accountId}
      networkId={route.params?.networkId}
      onSelect={onSelected}
      footer={null}
    />
  );
};

export default SelectSendingAccount;
