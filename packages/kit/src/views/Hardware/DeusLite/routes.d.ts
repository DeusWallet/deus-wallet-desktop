export const enum DeusLiteModalRoutes {
  DeusLiteChangePinInputPinModal = 'DeusLiteChangePinInputPinModal',
  DeusLiteChangePinSetModal = 'DeusLiteChangePinSetModal',
  DeusLiteChangePinRepeatModal = 'DeusLiteChangePinRepeatModal',
  DeusLiteChangePinModal = 'DeusLiteChangePinModal',
  DeusLiteRestorePinCodeVerifyModal = 'DeusLiteRestorePinCodeVerifyModal',
  DeusLiteRestoreModal = 'DeusLiteRestoreModal',
  DeusLiteRestoreDoneModal = 'DeusLiteRestoreDoneModal',
  DeusLiteBackupPinCodeVerifyModal = 'DeusLiteBackupPinCodeVerifyModal',
  DeusLiteBackupModal = 'DeusLiteBackupModal',
  DeusLiteResetModal = 'DeusLiteResetModal',
}

export type DeusLiteRoutesParams = {
  [DeusLiteModalRoutes.DeusLiteChangePinInputPinModal]: undefined;
  [DeusLiteModalRoutes.DeusLiteChangePinSetModal]: {
    currentPin: string;
  };
  [DeusLiteModalRoutes.DeusLiteChangePinRepeatModal]: {
    currentPin: string;
    newPin: string;
  };
  [DeusLiteModalRoutes.DeusLiteChangePinModal]: {
    oldPin: string;
    newPin: string;
  };
  [DeusLiteModalRoutes.DeusLiteRestorePinCodeVerifyModal]: undefined;
  [DeusLiteModalRoutes.DeusLiteRestoreModal]: {
    pinCode: string;
  };
  [DeusLiteModalRoutes.DeusLiteRestoreDoneModal]: {
    mnemonic: string;
    onSuccess: () => void;
  };
  [DeusLiteModalRoutes.DeusLiteBackupPinCodeVerifyModal]: {
    walletId: string | null;
    backupData: string;
    onSuccess: () => void;
  };
  [DeusLiteModalRoutes.DeusLiteBackupModal]: {
    walletId: string | null;
    pinCode: string;
    backupData: string;
    onSuccess: () => void;
  };
  [DeusLiteModalRoutes.DeusLiteResetModal]: undefined;
};
