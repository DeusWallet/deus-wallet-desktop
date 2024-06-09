import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Form, useIsVerticalLayout } from '@deushq/components';
import { isAllNetworks } from '@deushq/engine/src/managers/network';
import type { Network } from '@deushq/engine/src/types/network';
import { useManageNetworks } from '@deushq/kit/src/hooks';
import { useGeneral } from '@deushq/kit/src/hooks/redux';
import { DeusNetwork } from '@deushq/shared/src/config/networkIds';

import type { ControllerProps, FieldValues } from 'react-hook-form';

type FormChainSelectorProps = {
  selectableNetworks?: Array<string>;
  hideHelpText?: boolean;
  networkId?: string | null;
  disabledNetworkIds?: Array<string>;
};

function FormChainSelector<TFieldValues extends FieldValues = FieldValues>({
  selectableNetworks,
  networkId,
  hideHelpText = false,
  disabledNetworkIds,
  ...props
}: Omit<ControllerProps<TFieldValues>, 'render'> & FormChainSelectorProps) {
  const intl = useIntl();
  const { enabledNetworks: networks } = useManageNetworks(undefined);
  const { activeNetworkId: currentNetworkId } = useGeneral();
  const isSmallScreen = useIsVerticalLayout();

  let defaultNetworkId =
    networkId ?? isAllNetworks(currentNetworkId)
      ? DeusNetwork.eth
      : currentNetworkId;

  // If selectableNetworks is specified and currenct selected network not in
  // it, set the first selectable network as the default.
  if (
    typeof selectableNetworks !== 'undefined' &&
    (typeof currentNetworkId === 'undefined' ||
      !selectableNetworks.includes(currentNetworkId ?? ''))
  ) {
    [defaultNetworkId] = selectableNetworks;
  }

  const options = useMemo(() => {
    if (!networks) return [];

    return networks
      .filter((network) => {
        if (disabledNetworkIds?.includes(network?.id)) {
          return false;
        }
        return (
          typeof selectableNetworks === 'undefined' ||
          selectableNetworks.includes(network.id)
        );
      })
      .map((network) => ({
        label: network.shortName,
        value: network.id,
        tokenProps: {
          token: {
            logoURI: network?.logoURI,
            name: network?.shortName,
          },
        },
        badge: network.impl === 'evm' ? 'EVM' : undefined,
      }));
  }, [networks, selectableNetworks, disabledNetworkIds]);

  const findActiveNetwork = useCallback<(id: string) => Network | null>(
    (id) => {
      if (!networks) return null;

      let selectedNetwork: Network | null = null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      networks.forEach((network) => {
        if (network.id === id) {
          selectedNetwork = network;
        }
      });

      return selectedNetwork;
    },
    [networks],
  );

  return (
    <Form.Item
      label={intl.formatMessage({ id: 'network__network' })}
      helpText={
        hideHelpText
          ? undefined
          : (activeNetworkId = defaultNetworkId) => {
              const activeNetworkPayload = findActiveNetwork(activeNetworkId);
              return intl.formatMessage(
                {
                  id: 'form__network_helperText',
                },
                {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  impl: activeNetworkPayload?.impl ?? '-',
                },
              );
            }
      }
      defaultValue={defaultNetworkId as any}
      {...props}
    >
      <Form.Select
        title={intl.formatMessage({ id: 'network__network' })}
        footer={null}
        triggerSize={isSmallScreen ? 'xl' : 'default'}
        options={options}
        headerShown={false}
        dropdownProps={!isSmallScreen ? { maxHeight: '272px' } : undefined}
        dropdownPosition="right"
      />
    </Form.Item>
  );
}

export default FormChainSelector;
