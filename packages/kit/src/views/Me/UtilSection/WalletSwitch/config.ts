import DeusLogo from '@deushq/kit/assets/logo_round.png';
import AptosMartianLogo from '@deushq/kit/assets/walletLogo/aptos_martian.png';
import AptosPetraLogo from '@deushq/kit/assets/walletLogo/aptos_petra.png';
import UniSatLogo from '@deushq/kit/assets/walletLogo/btc_unisat.png';
import CardanoNamiLogo from '@deushq/kit/assets/walletLogo/cardano_nami.png';
import ConflusFluentLogo from '@deushq/kit/assets/walletLogo/conflux_fluent_wallet.png';
import CosmosKeplrLogo from '@deushq/kit/assets/walletLogo/cosmos_keplr.png';
import MetamaskLogo from '@deushq/kit/assets/walletLogo/evm_metamask.png';
import PolkadotJsLogo from '@deushq/kit/assets/walletLogo/polkadot_polkadot_js.png';
import SolanaPhantomLogo from '@deushq/kit/assets/walletLogo/solana_phantom.png';
import StarcoinStarmaskLogo from '@deushq/kit/assets/walletLogo/starcoin_starmask.png';
import SuiWalletLogo from '@deushq/kit/assets/walletLogo/sui_sui_wallet.png';
import TronLinkLogo from '@deushq/kit/assets/walletLogo/tron_tronlink.png';

import type { WalletSwitchItem } from '../../../../store/reducers/settings';

export function getNetworkWithWalletId(walletId: string) {
  return walletId.split('-')[0];
}

/**
 * MonopolizeNetwork indicates that the network only supports injection of one wallet.
 */
export const MonopolizeNetwork = ['POLKADOT'];

export const CWalletSwitchDefaultConfig: Record<string, WalletSwitchItem> = {
  'BTC-UniSat': {
    logo: UniSatLogo,
    title: 'UniSat ',
    propertyKeys: ['unisat'],
    enable: true,
  },
  'EVM-Metamask': {
    logo: MetamaskLogo,
    title: 'Metamask',
    propertyKeys: ['ethereum'],
    enable: true,
  },
  'COSMOS-Keplr': {
    logo: CosmosKeplrLogo,
    title: 'Keplr',
    propertyKeys: [
      'keplr',
      'getOfflineSigner',
      'getOfflineSignerOnlyAmino',
      'getOfflineSignerAuto',
    ],
    enable: true,
  },
  'APTOS-Petra': {
    logo: AptosPetraLogo,
    title: 'Petra',
    propertyKeys: ['aptos', 'petra'],
    enable: true,
  },
  'APTOS-Martian': {
    logo: AptosMartianLogo,
    title: 'Martian',
    propertyKeys: ['martian'],
    enable: false,
  },
  'SUI-deus': {
    logo: DeusLogo,
    title: 'Deus(Sui)',
    propertyKeys: ['deus-sui'],
    enable: true,
  },
  'SUI-Sui Wallet': {
    logo: SuiWalletLogo,
    title: 'Sui Wallet',
    propertyKeys: ['suiWallet'],
    enable: true,
  },
  'SOLANA-deus': {
    logo: DeusLogo,
    title: 'Deus(Solana)',
    propertyKeys: ['deus-solana'],
    enable: true,
  },
  'SOLANA-Phantom': {
    logo: SolanaPhantomLogo,
    title: 'Phantom',
    propertyKeys: ['solana', 'phantom'],
    enable: true,
  },
  'TRON-TronLink': {
    logo: TronLinkLogo,
    title: 'TronLink',
    propertyKeys: ['tronLink', 'tronWeb', 'sunWeb'],
    enable: true,
  },
  'CARDANO-Nami': {
    logo: CardanoNamiLogo,
    title: 'Nami',
    propertyKeys: ['cardano'],
    enable: true,
  },
  'STARCOIN-StarMask': {
    logo: StarcoinStarmaskLogo,
    title: 'StarMask',
    propertyKeys: ['starcoin'],
    enable: true,
  },
  'CONFLUX-Fluent': {
    logo: ConflusFluentLogo,
    title: 'Fluent',
    propertyKeys: ['conflux'],
    enable: true,
  },
  'POLKADOT-deus': {
    logo: DeusLogo,
    title: 'Deus(Polkadot)',
    propertyKeys: ['deus-polkadot'],
    enable: true,
  },
  'POLKADOT-polkadot-js': {
    logo: PolkadotJsLogo,
    title: 'Polkadot.js',
    propertyKeys: ['polkadot-js'],
    enable: false,
  },
};
