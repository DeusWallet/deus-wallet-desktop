import { Web3RpcError } from '@deusfe/cross-inpage-provider-errors';
import { get } from 'lodash';

/* eslint max-classes-per-file: "off" */

import type { LocaleIds } from '@deushq/components/src/locale';

export enum DeusErrorClassNames {
  DeusError = 'DeusError',
  DeusHardwareError = 'DeusHardwareError',
  DeusValidatorError = 'DeusValidatorError',
  DeusValidatorTip = 'DeusValidatorTip',
  DeusAbortError = 'DeusAbortError',
  DeusWalletConnectModalCloseError = 'DeusWalletConnectModalCloseError',
  DeusAlreadyExistWalletError = 'DeusAlreadyExistWalletError',
  DeusErrorInsufficientNativeBalance = 'DeusErrorInsufficientNativeBalance',
}

export type IDeusErrorInfo = Record<string | number, string | number>;

export type DeusHardwareErrorData = {
  reconnect?: boolean | undefined;
  connectId?: string;
  deviceId?: string;
};

export type DeusHardwareErrorPayload = {
  code?: number;
  error?: string;
  message?: string;
  params?: any;
  connectId?: string;
  deviceId?: string;
};

export class DeusError<T = Error> extends Web3RpcError<T> {
  className = DeusErrorClassNames.DeusError;

  info: IDeusErrorInfo;

  key: LocaleIds | string = 'deus_error';

  constructor(message?: string, info?: IDeusErrorInfo) {
    super(-99999, message || 'Unknown deus internal error.');
    this.info = info || {};
  }

  override get message() {
    // TODO key message with i18n
    // @ts-ignore
    return super.message || this.key;
  }
}

class NumberLimit extends DeusError {
  override key = 'generic_number_limitation';

  constructor(limit: number) {
    super('', { limit: limit.toString() });
  }
}

class StringLengthRequirement extends DeusError {
  override key = 'generic_string_length_requirement';

  constructor(minLength: number, maxLength: number) {
    super('', {
      minLength: minLength.toString(),
      maxLength: maxLength.toString(),
    });
  }
}

// Generic errors.

export class NotImplemented extends DeusError {
  constructor(message?: string) {
    super(message || 'DeusError: NotImplemented', {});
  }

  override key = 'msg__engine__not_implemented';
}

export class DeusInternalError extends DeusError {
  override key = 'msg__engine__internal_error';

  constructor(message?: string, key?: LocaleIds) {
    super(message || 'DeusError: Internal error', {});
    if (key) {
      this.key = key;
    }
  }
}

export class DeusHardwareError<
  T extends DeusHardwareErrorData = DeusHardwareErrorData,
> extends DeusError<T> {
  override className = DeusErrorClassNames.DeusHardwareError;

  codeHardware?: string;

  override key: LocaleIds = 'msg__hardware_default_error';

  static handleErrorParams(
    params?: any,
    errorParams?: Record<string | number, string>,
  ): IDeusErrorInfo {
    const info: IDeusErrorInfo = {};
    Object.keys(errorParams || {}).forEach((key) => {
      const valueKey = errorParams?.[key];
      if (valueKey) {
        const value = get(params, valueKey, '');
        info[key] = value;
      }
    });

    return info;
  }

  /**
   * create DeusHardwareError from DeusHardware error payload
   * @param errorPayload Hardware error payload
   * @param errorParams Hardware Error params, key is i18n placeholder, value is error payload key
   */
  constructor(
    errorPayload?: DeusHardwareErrorPayload,
    errorParams?: Record<string | number, string>,
    data?: T,
  ) {
    super(
      errorPayload?.error ?? errorPayload?.message ?? 'Unknown hardware error',
      DeusHardwareError.handleErrorParams(
        errorPayload?.params,
        errorParams,
      ) || {},
    );
    const { code, deviceId, connectId } = errorPayload || {};
    this.codeHardware = code?.toString();
    this.data = {
      deviceId,
      connectId,
      reconnect: this.data?.reconnect,
      ...data,
    } as T;
  }
}

export class DeusHardwareAbortError extends DeusError {
  override className = DeusErrorClassNames.DeusAbortError;

  override key = 'msg__engine__internal_error';
}

export class DeusAlreadyExistWalletError extends DeusHardwareError<
  {
    walletId: string;
    walletName: string | undefined;
  } & DeusHardwareErrorData
> {
  override className = DeusErrorClassNames.DeusAlreadyExistWalletError;

  override key: LocaleIds = 'msg__wallet_already_exist';

  constructor(walletId: string, walletName: string | undefined) {
    super(undefined, undefined, { walletId, walletName });
  }
}

export class DeusValidatorError extends DeusError {
  override className = DeusErrorClassNames.DeusValidatorError;

  override key = 'deus_error_validator';

  constructor(key: string, info?: IDeusErrorInfo, message?: string) {
    super(message, info);
    this.key = key;
  }
}

export class DeusValidatorTip extends DeusError {
  override className = DeusErrorClassNames.DeusValidatorTip;

  override key = 'deus_tip_validator';

  constructor(key: string, info?: IDeusErrorInfo, message?: string) {
    super(message, info);
    this.key = key;
  }
}

export class FailedToTransfer extends DeusError {
  override key = 'msg__engine__failed_to_transfer';
}

export class WrongPassword extends DeusError {
  override key = 'msg__engine__incorrect_password';
}

export class PasswordStrengthValidationFailed extends DeusError {
  override key = 'msg__password_validation';
}

// Simple input errors.

export class InvalidMnemonic extends DeusError {
  override key = 'msg__engine__invalid_mnemonic';
}

export class MimimumBalanceRequired extends DeusError {
  override key = 'msg__str_minimum_balance_is_str';

  constructor(token: string, amount: string) {
    super('', { token, amount });
  }
}

export class RecipientHasNotActived extends DeusError {
  override key = 'msg__recipient_hasnt_activated_str';

  constructor(tokenName: string) {
    super('', { '0': tokenName });
  }
}

export class InvalidAddress extends DeusError {
  override key = 'msg__engine__incorrect_address';

  constructor(message?: string, info?: IDeusErrorInfo) {
    super(message || 'InvalidAddress.', info);
  }
}

export class InvalidSameAddress extends DeusError {
  override key = 'form__address_cannot_send_to_myself';

  constructor(message?: string, info?: IDeusErrorInfo) {
    super(message || 'InvalidAddress.', info);
  }
}

export class InvalidAccount extends DeusError {
  override key = 'msg__engine__account_not_activated';

  constructor(message?: string, info?: IDeusErrorInfo) {
    super(message || 'InvalidAccount.', info);
  }
}

export class InvalidTokenAddress extends DeusError {
  override key = 'msg__engine__incorrect_token_address';
}

export class InvalidTransferValue extends DeusError {
  override key = 'msg__engine__incorrect_transfer_value';

  constructor(key?: string, info?: IDeusErrorInfo) {
    super('Invalid Transfer Value', info);
    this.key = key ?? 'msg__engine__incorrect_transfer_value';
  }
}

export class TransferValueTooSmall extends DeusError {
  override key = 'msg__amount_too_small';

  constructor(key?: string, info?: IDeusErrorInfo) {
    super('Transfer Value too small', info);
    this.key = key ?? 'msg__amount_too_small';
  }
}

// **** only for Native Token  InsufficientBalance
export class InsufficientBalance extends DeusError {
  override className =
    DeusErrorClassNames.DeusErrorInsufficientNativeBalance;

  // For situations that utxo selection failed.
  override key = 'form__amount_invalid';
}

export class InsufficientGasFee extends DeusError {
  override key = 'msg__suggest_reserving_str_as_gas_fee';

  constructor(token: string, amount: string) {
    super('', { '0': `${amount} ${token}` });
  }
}

export class WalletNameLengthError extends StringLengthRequirement {
  override key = 'msg__engine__wallet_name_length_error';
}

export class AccountNameLengthError extends StringLengthRequirement {
  override key = 'msg__engine__account_name_length_error';

  constructor(name: string, minLength: number, maxLength: number) {
    super(minLength, maxLength);
    this.info = { name, ...this.info };
  }
}

export class WatchedAccountTradeError extends DeusError {
  override key = 'form__error_trade_with_watched_acocunt';
}

// Limitations.

export class AccountAlreadyExists extends DeusError {
  override key = 'msg__engine__account_already_exists';
}

export class PreviousAccountIsEmpty extends DeusError {
  override key = 'content__previous_str_account_is_empty';

  constructor(accountTypeStr: string, key?: LocaleIds) {
    super('', { '0': accountTypeStr });
    if (key) {
      this.key = key;
    }
  }
}

export class TooManyWatchingAccounts extends NumberLimit {
  override key = 'msg__engine_too_many_watching_accounts';
}

export class TooManyExternalAccounts extends NumberLimit {
  override key = 'msg__engine_too_many_external_accounts';
}

export class TooManyImportedAccounts extends NumberLimit {
  override key = 'msg__engine__too_many_imported_accounts';
}

export class TooManyHDWallets extends NumberLimit {
  override key = 'msg__engine__too_many_hd_wallets';
}

export class TooManyHWWallets extends NumberLimit {
  override key = 'msg__engine__too_many_hw_wallets';
}

export class TooManyHWPassphraseWallets extends NumberLimit {
  override key = 'msg__engine__too_many_hw_passphrase_wallets';
}

export class TooManyDerivedAccounts extends NumberLimit {
  override key = 'msg__engine__too_many_derived_accounts';

  constructor(limit: number, coinType: number, purpose: number) {
    super(limit);
    this.info = {
      coinType: coinType.toString(),
      purpose: purpose.toString(),
      ...this.info,
    };
  }
}

export class PendingQueueTooLong extends NumberLimit {
  override key = 'msg__engine__pending_queue_too_long';
}

// WalletConnect ----------------------------------------------
export class DeusWalletConnectModalCloseError extends DeusError {
  override className = DeusErrorClassNames.DeusWalletConnectModalCloseError;
  // override key = 'msg__engine__internal_error';
}

export class FailedToEstimatedGasError extends DeusError {
  override key = 'msg__estimated_gas_failure';
}

// Lightning Network ----------------------------------------------
export class InvalidLightningPaymentRequest extends DeusError {
  override key = 'msg__invalid_lightning_payment_request';
}

export class InvoiceAlreadPaid extends DeusError {
  override key = 'msg__invoice_is_already_paid';
}

export class NoRouteFoundError extends DeusError {
  override key = 'msg__no_route_found';
}

export class ChannelInsufficientLiquidityError extends DeusError {
  override key = 'msg__insufficient_liquidity_of_lightning_node_channels';
}

export class BadAuthError extends DeusError {
  override key = 'msg__authentication_failed_verify_again';
}

export class InvoiceExpiredError extends DeusError {
  override key = 'msg__the_invoice_has_expired';
}

export class MaxSendAmountError extends DeusError {
  override key = 'msg__the_sending_amount_cannot_exceed_int_sats';

  constructor(key: string, info?: IDeusErrorInfo, message?: string) {
    super(message, info);
  }
}

export class NotEnoughBalanceIncludeTenSatsError extends DeusError {
  override key =
    'msg__insufficient_balance_make_sure_at_least_10_sats_reserved_for_potential_fee_fluctuations';
}

export class NotEnoughBalanceIncludeOnePercentError extends DeusError {
  override key =
    'msg__insufficient_balance_make_sure_at_least_1_percent_ofinvoice_amount_reserved_for_potential_fee_fluctuations';
}

export class TaprootAddressError extends DeusError {
  override key =
    'msg__invalid_address_ordinal_can_only_be_sent_to_taproot_address';
}

export class InscribeFileTooLargeError extends DeusError {
  override key = 'msg__file_size_should_less_than_str';

  constructor(key?: LocaleIds) {
    super('', { '0': '200KB' });
    if (key) {
      this.key = key;
    }
  }
}

export class UtxoNotFoundError extends DeusError {
  override key = 'msg__nft_does_not_exist';
}

export class MinimumTransferBalanceRequiredError extends DeusError {
  override key =
    'msg__the_minimum_value_for_transffering_to_a_new_account_is_str_str';

  constructor(amount: string, symbol: string) {
    super('', {
      amount,
      symbol,
    });
  }
}

export class MinimumTransferBalanceRequiredForSendingAssetError extends DeusError {
  override key =
    'msg__sending_str_requires_an_account_balance_of_at_least_str_str';

  constructor(name: string, amount: string, symbol: string) {
    super('', {
      '0': name,
      '1': amount,
      '2': symbol,
    });
  }
}

export class ChangeLessThanMinInputCapacityError extends DeusError {
  override key = 'msg__the_balance_after_the_tx_must_not_be_less_than_str';

  constructor(amount: string) {
    super(`The change cannot be less than that ${amount}`, {
      '0': amount,
    });
    this.key = 'msg__the_balance_after_the_tx_must_not_be_less_than_str';
  }
}

export class MinimumTransferAmountError extends DeusError {
  override key = 'form__str_minimum_transfer';

  constructor(amount: string) {
    super(`${amount} Minimum Transfer Amount`, {
      '0': amount,
    });
    this.key = 'form__str_minimum_transfer';
  }
}

// all networks ----------------------------------------------
export class AllNetworksMinAccountsError extends DeusError {
  override key = 'msg__you_need_str_accounts_on_any_network_to_create';
}

export class AllNetworksUpto3LimitsError extends DeusError {
  override key = 'msg__currently_supports_up_to_str_all_networks_accounts';
}
