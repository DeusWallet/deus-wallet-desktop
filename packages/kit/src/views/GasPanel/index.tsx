import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRoute } from '@react-navigation/native';
import { useIntl } from 'react-intl';

import { Center, HStack, Modal, Spinner, Switch } from '@deushq/components';
import type { IGasInfo } from '@deushq/engine/src/types/gas';
import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

import backgroundApiProxy from '../../background/instance/backgroundApiProxy';
import { useNativeToken, useSettings } from '../../hooks';
import { appSelector } from '../../store';
import { setGasPanelEIP1559Enabled } from '../../store/reducers/settings';

import { supportedNetworks, supportedNetworksSettings } from './config';
import { GasList } from './GasList';
import { GasOverview } from './GasOverview';
import { GasRefreshTip } from './GasRefreshTip';
import { NetworkSelector } from './NetworkSelector';

import type { GasPanelRoutes, GasPanelRoutesParams } from './types';
import type { RouteProp } from '@react-navigation/native';

type RouteProps = RouteProp<GasPanelRoutesParams, GasPanelRoutes.GasPanelModal>;

const DEFAULT_NETWORK = DeusNetwork.eth;
const REFRESH_GAS_INFO_INTERVAL = 6000;

function GasPanel() {
  const intl = useIntl();
  const route = useRoute<RouteProps>();
  const fetchIdRef = useRef('');

  const { networkId = '' } = route.params;

  const { selectedFiatMoneySymbol } = appSelector((s) => s.settings);

  const [selectedNetworkId, setSelectedNetworkId] = useState(
    supportedNetworks.includes(networkId) ? networkId : DEFAULT_NETWORK,
  );
  const [isGasInfoInit, setIsGasInfoInit] = useState(false);
  const [gasInfo, setGasInfo] = useState<IGasInfo | null>(null);
  const [leftSeconds, setLeftSeconds] = useState(
    REFRESH_GAS_INFO_INTERVAL / 1000,
  );
  const settings = useSettings();

  const token = useNativeToken(selectedNetworkId);

  const { serviceGas } = backgroundApiProxy;

  const isEIP1559 = useMemo(() => {
    if (gasInfo && gasInfo.prices[0]) {
      return (
        typeof gasInfo.prices[0] === 'object' &&
        'maxFeePerGas' in gasInfo.prices[0] &&
        'maxPriorityFeePerGas' in gasInfo.prices[0]
      );
    }
    return false;
  }, [gasInfo]);

  const isEIP1559Enabled = settings?.gasPanelEIP1559Enabled ?? true;

  const setIsEIP1559Enabled = useCallback((isEnabled) => {
    backgroundApiProxy.dispatch(setGasPanelEIP1559Enabled(isEnabled));
  }, []);

  const fetchGasInfo = useCallback(async () => {
    const fetchId = Math.random().toString();
    fetchIdRef.current = fetchId;
    const resp = await serviceGas.getGasInfo({
      networkId: selectedNetworkId,
    });

    if (resp.prices.length === 5) {
      resp.prices = [resp.prices[0], resp.prices[2], resp.prices[4]];
    }

    if (fetchId === fetchIdRef.current) {
      setGasInfo(resp);
      setIsGasInfoInit(true);
      setLeftSeconds(REFRESH_GAS_INFO_INTERVAL / 1000);
    }
  }, [selectedNetworkId, serviceGas]);

  useEffect(() => {
    setGasInfo(null);
    fetchGasInfo();
  }, [fetchGasInfo, selectedNetworkId, serviceGas]);

  useEffect(() => {
    if (networkId && supportedNetworks.includes(networkId)) {
      setSelectedNetworkId(networkId);
    }
  }, [networkId]);

  useEffect(() => {
    backgroundApiProxy.servicePrice.fetchSimpleTokenPrice({
      networkId: selectedNetworkId,
      tokenIds: [token?.tokenIdOnNetwork ?? ''],
      vsCurrency: selectedFiatMoneySymbol,
    });
  }, [
    networkId,
    selectedFiatMoneySymbol,
    selectedNetworkId,
    token?.tokenIdOnNetwork,
  ]);

  return (
    <Modal
      header={intl.formatMessage({ id: 'content__gas_fee' })}
      height="560px"
      hideSecondaryAction
      onPrimaryActionPress={({ close }) => close()}
      primaryActionProps={{
        type: 'primary',
      }}
      primaryActionTranslationId="action__i_got_it"
      scrollViewProps={{
        children: isGasInfoInit ? (
          <>
            <HStack justifyContent="space-between" alignItems="center">
              <NetworkSelector
                selectedNetworkId={selectedNetworkId}
                setSelectedNetworkId={setSelectedNetworkId}
              />

              {isEIP1559 &&
              supportedNetworksSettings[selectedNetworkId].EIP1559Enabled ? (
                <Switch
                  onToggle={() => {
                    setIsEIP1559Enabled(!isEIP1559Enabled);
                  }}
                  isChecked={isEIP1559Enabled}
                  label="EIP 1559"
                  size="mini"
                />
              ) : null}
            </HStack>
            {supportedNetworksSettings[selectedNetworkId].supportOverview ? (
              <GasOverview
                mt={8}
                gasInfo={gasInfo}
                isEIP1559Enabled={isEIP1559Enabled}
                selectedNetworkId={selectedNetworkId}
              />
            ) : null}
            <GasList
              mt={6}
              gasInfo={gasInfo}
              isEIP1559Enabled={isEIP1559Enabled}
              selectedNetworkId={selectedNetworkId}
            />
            {gasInfo ? (
              <GasRefreshTip
                mt={12}
                leftSeconds={leftSeconds}
                setLeftSeconds={setLeftSeconds}
                fetchGasInfo={fetchGasInfo}
              />
            ) : null}
          </>
        ) : (
          <Center w="full" py={10}>
            <Spinner size="lg" />
          </Center>
        ),
      }}
    />
  );
}

export { GasPanel };
