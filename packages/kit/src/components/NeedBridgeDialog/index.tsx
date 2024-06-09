import type { FC } from 'react';
import { useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Center } from '@deushq/components';
import Dialog from '@deushq/components/src/Dialog';
import Icon from '@deushq/components/src/Icon';
import { HARDWARE_BRIDGE_DOWNLOAD_URL } from '@deushq/shared/src/config/appConfig';

import { openUrlExternal } from '../../utils/openUrl';

import type { MessageDescriptor } from 'react-intl';

export type NeedBridgeDialogProps = {
  onClose?: () => void;
  update?: boolean;
  version?: string;
};

const NeedBridgeDialog: FC<NeedBridgeDialogProps> = ({
  onClose,
  update,
  version,
}) => {
  const intl = useIntl();

  const icon = useMemo(
    () =>
      update ? (
        <Center p={3} rounded="full" bgColor="surface-warning-default">
          <Icon name="UploadOutline" color="icon-warning" size={24} />
        </Center>
      ) : (
        <Icon name="ExclamationTriangleOutline" size={48} />
      ),
    [update],
  );
  const title = useMemo<MessageDescriptor['id']>(
    () =>
      update
        ? 'title__requires_updating_of_deus_bridge'
        : 'modal__need_install_deus_bridge',
    [update],
  );
  const content = useMemo<MessageDescriptor['id']>(
    () =>
      update
        ? 'content__deus_bridge_str_is_now_available_do_you_want_to_download'
        : 'modal__need_install_deus_bridge_desc',
    [update],
  );

  return (
    <Dialog
      visible
      onClose={onClose}
      contentProps={{
        icon,
        title: intl.formatMessage({ id: title }),
        content: intl.formatMessage(
          {
            id: content,
          },
          update ? { 0: version ?? '' } : undefined,
        ),
      }}
      footerButtonProps={{
        primaryActionTranslationId: 'action__download',
        // eslint-disable-next-line @typescript-eslint/no-shadow
        onPrimaryActionPress: ({ onClose }) => {
          openUrlExternal(HARDWARE_BRIDGE_DOWNLOAD_URL);
          onClose?.();
        },
      }}
    />
  );
};
NeedBridgeDialog.displayName = 'NeedBridgeDialog';

export default NeedBridgeDialog;
