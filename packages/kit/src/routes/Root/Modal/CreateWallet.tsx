import { useIsVerticalLayout } from '@deushq/components';
import type { IWallet } from '@deushq/engine/src/types';
import type { Account } from '@deushq/engine/src/types/account';
import type { UserInputCheckResult } from '@deushq/engine/src/types/credential';
import type { Wallet } from '@deushq/engine/src/types/wallet';

import { WalletConnectQrcodeModal } from '../../../components/WalletConnect/WalletConnectQrcodeModal';
import AddImportedAccountDone from '../../../views/CreateWallet/Account/AddImportedAccountDone';
import AddImportedOrWatchingAccount from '../../../views/CreateWallet/Account/AddImportedOrWatchingAccount';
import AddExistingWallet from '../../../views/CreateWallet/AddExistingWallet';
import AttentionsView from '../../../views/CreateWallet/AppWallet/AttentionsView';
import AppWalletDone from '../../../views/CreateWallet/AppWallet/Done';
import { MnemonicContainer } from '../../../views/CreateWallet/AppWallet/Mnemonic';
import NewWallet from '../../../views/CreateWallet/AppWallet/NewWallet';
import ConnectHardware from '../../../views/CreateWallet/HardwareWallet/ConnectHardware';
import DeviceStatusCheck from '../../../views/CreateWallet/HardwareWallet/DeviceStatusCheck';
import RestoreHardwareWallet from '../../../views/CreateWallet/HardwareWallet/RestoreHardwareWallet';
import RestoreHardwareWalletDescription from '../../../views/CreateWallet/HardwareWallet/RestoreHardwareWalletDescription';
import SetupHardware from '../../../views/CreateWallet/HardwareWallet/SetupHardware';
import SetupNewDevice from '../../../views/CreateWallet/HardwareWallet/SetupNewDevice';
import SetupSuccess from '../../../views/CreateWallet/HardwareWallet/SetupSuccess';
import DeusLiteBackup from '../../../views/Hardware/DeusLite/Backup';
import DeusLiteBackupPinCode from '../../../views/Hardware/DeusLite/PinCode/BackupPinCodeVerify';
import DeusLiteRestorePinCode from '../../../views/Hardware/DeusLite/PinCode/RestorePinCodeVerify';
import DeusLiteRestore from '../../../views/Hardware/DeusLite/Restore';
import DeusLiteRestoreDoneView from '../../../views/Hardware/DeusLite/Restore/Done';
import { CreateWalletModalRoutes } from '../../routesEnum';

import { buildModalStackNavigatorOptions } from './buildModalStackNavigatorOptions';
import createStackNavigator from './createStackNavigator';

import type { WalletService } from '../../../components/WalletConnect/types';
import type { SearchDevice } from '../../../utils/hardware';
import type { SetupNewDeviceType } from '../../../views/CreateWallet/HardwareWallet/SetupNewDevice';
import type {
  DeusLiteModalRoutes,
  DeusLiteRoutesParams,
} from '../../../views/Hardware/DeusLite/routes';

export type IAddExistingWalletMode =
  | 'all'
  | 'mnemonic'
  | 'watching'
  | 'imported';
export type IAddExistingWalletModalParams = {
  mode: IAddExistingWalletMode;
  presetText?: string;
  wallet?: IWallet;
};
export type IAddImportedOrWatchingAccountModalParams = {
  defaultName?: string;
  text: string;
  checkResults: Array<UserInputCheckResult>;
  onSuccess?: (options: { wallet?: Wallet; account?: Account }) => void;
};
export type IAppWalletDoneModalParams = {
  mnemonic?: string;
  onSuccess?: (options: { wallet: Wallet }) => void;
};
export type IAddImportedAccountDoneModalParams = {
  privatekey: string;
  networkId: string;
  name: string;
  template?: string;
  onSuccess?: (options: { account: Account }) => void;
  onFailure?: () => void;
};
export type CreateWalletRoutesParams = {
  [CreateWalletModalRoutes.ConnectHardwareModal]: {
    entry?: 'onboarding' | 'walletSelector';
  };
  [CreateWalletModalRoutes.AttentionsModal]: {
    password: string;
    withEnableAuthentication?: boolean;
  };
  [CreateWalletModalRoutes.MnemonicModal]: {
    password: string;
    withEnableAuthentication?: boolean;
    mnemonic: string;
  };
  [CreateWalletModalRoutes.NewWalletModal]: undefined;
  [CreateWalletModalRoutes.AppWalletDoneModal]: IAppWalletDoneModalParams;
  [CreateWalletModalRoutes.SetupSuccessModal]: {
    device: SearchDevice;
    onPressOnboardingFinished?: () => Promise<void>;
  };
  [CreateWalletModalRoutes.SetupHardwareModal]: { device: SearchDevice };
  [CreateWalletModalRoutes.SetupNewDeviceModal]: {
    device: SearchDevice;
    type: SetupNewDeviceType;
  };
  [CreateWalletModalRoutes.DeviceStatusCheckModal]: {
    device: SearchDevice;
    entry?: 'onboarding' | 'walletSelector';
  };
  [CreateWalletModalRoutes.RestoreHardwareWalletModal]: {
    device: SearchDevice;
  };
  [CreateWalletModalRoutes.RestoreHardwareWalletDescriptionModal]: {
    device: SearchDevice;
  };
  [CreateWalletModalRoutes.CreateImportedAccount]: undefined;
  [CreateWalletModalRoutes.CreateWatchedAccount]: undefined;
  [CreateWalletModalRoutes.AddExistingWalletModal]: IAddExistingWalletModalParams;
  [CreateWalletModalRoutes.AddImportedOrWatchingAccountModal]: IAddImportedOrWatchingAccountModalParams;
  [CreateWalletModalRoutes.AddImportedAccountDoneModal]: IAddImportedAccountDoneModalParams;

  // Deus Lite Backup & Restore
  [CreateWalletModalRoutes.DeusLiteRestorePinCodeVerifyModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteRestorePinCodeVerifyModal];
  [CreateWalletModalRoutes.DeusLiteRestoreModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteRestoreModal];
  [CreateWalletModalRoutes.DeusLiteRestoreDoneModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteRestoreDoneModal];
  [CreateWalletModalRoutes.DeusLiteBackupPinCodeVerifyModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteBackupPinCodeVerifyModal];
  [CreateWalletModalRoutes.DeusLiteBackupModal]: DeusLiteRoutesParams[DeusLiteModalRoutes.DeusLiteBackupModal];
  [CreateWalletModalRoutes.WalletConnectQrcodeModal]: {
    connectToWalletService: (
      walletService: WalletService,
      uri?: string,
    ) => Promise<void>;
    uri?: string;
    onDismiss: () => void;
    shouldRenderQrcode: boolean;
  };
};

const CreateWalletNavigator = createStackNavigator<CreateWalletRoutesParams>();

const modalRoutes = [
  {
    name: CreateWalletModalRoutes.ConnectHardwareModal,
    component: ConnectHardware,
  },
  {
    name: CreateWalletModalRoutes.SetupSuccessModal,
    component: SetupSuccess,
  },
  {
    name: CreateWalletModalRoutes.SetupHardwareModal,
    component: SetupHardware,
  },
  {
    name: CreateWalletModalRoutes.SetupNewDeviceModal,
    component: SetupNewDevice,
  },
  {
    name: CreateWalletModalRoutes.DeviceStatusCheckModal,
    component: DeviceStatusCheck,
  },
  {
    name: CreateWalletModalRoutes.RestoreHardwareWalletModal,
    component: RestoreHardwareWallet,
  },
  {
    name: CreateWalletModalRoutes.RestoreHardwareWalletDescriptionModal,
    component: RestoreHardwareWalletDescription,
  },
  {
    name: CreateWalletModalRoutes.AppWalletDoneModal,
    component: AppWalletDone,
  },

  // Deus Lite backup
  {
    name: CreateWalletModalRoutes.DeusLiteRestorePinCodeVerifyModal,
    component: DeusLiteRestorePinCode,
  },
  {
    name: CreateWalletModalRoutes.DeusLiteRestoreModal,
    component: DeusLiteRestore,
  },
  {
    name: CreateWalletModalRoutes.DeusLiteRestoreDoneModal,
    component: DeusLiteRestoreDoneView,
  },
  {
    name: CreateWalletModalRoutes.DeusLiteBackupPinCodeVerifyModal,
    component: DeusLiteBackupPinCode,
  },
  {
    name: CreateWalletModalRoutes.DeusLiteBackupModal,
    component: DeusLiteBackup,
  },
  {
    name: CreateWalletModalRoutes.AddExistingWalletModal,
    component: AddExistingWallet,
  },
  {
    name: CreateWalletModalRoutes.WalletConnectQrcodeModal,
    component: WalletConnectQrcodeModal,
  },
  {
    name: CreateWalletModalRoutes.AddImportedOrWatchingAccountModal,
    component: AddImportedOrWatchingAccount,
  },
  {
    name: CreateWalletModalRoutes.AddImportedAccountDoneModal,
    component: AddImportedAccountDone,
  },
  {
    name: CreateWalletModalRoutes.AttentionsModal,
    component: AttentionsView,
  },
  {
    name: CreateWalletModalRoutes.MnemonicModal,
    component: MnemonicContainer,
  },
  {
    name: CreateWalletModalRoutes.NewWalletModal,
    component: NewWallet,
  },
];

const CreateWalletModalStack = () => {
  const isVerticalLayout = useIsVerticalLayout();
  return (
    <CreateWalletNavigator.Navigator
      screenOptions={(navInfo) => ({
        ...buildModalStackNavigatorOptions({ isVerticalLayout, navInfo }),
      })}
    >
      {modalRoutes.map((route) => (
        <CreateWalletNavigator.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </CreateWalletNavigator.Navigator>
  );
};

export default CreateWalletModalStack;
