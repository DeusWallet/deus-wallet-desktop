import { useIntl } from 'react-intl';

import { Box, Typography } from '@deushq/components';
import type { NFTBTCAssetModel } from '@deushq/engine/src/types/nft';
import {
  type INFTAsset,
  type NFTAsset,
  NFTAssetType,
} from '@deushq/engine/src/types/nft';

import OrdinalsSVG from '../../../components/SVG/OrdinalsSVG';
// import NFTBTCContent from '../../Wallet/NFT/NFTList/NFTBTCContent';
import NFTListImage from '../../Wallet/NFT/NFTList/NFTListImage';

function NFTBTCView({ asset }: { asset: NFTBTCAssetModel }) {
  if (asset) {
    return (
      <Box flexDirection="row" alignItems="center">
        <OrdinalsSVG width={40} height={40} />
        <Typography.Body1Strong ml={3} numberOfLines={2} flex={1}>
          {`Inscription #${asset.inscription_number}`}
        </Typography.Body1Strong>
      </Box>
    );
  }
  return <Box size="40px" />;
}

function NFTEVMView({ asset, total }: { asset: NFTAsset; total: number }) {
  const intl = useIntl();
  return (
    <Box flexDirection="row" alignItems="center">
      <NFTListImage asset={asset} borderRadius="6px" size={40} />
      <Typography.Body1Strong ml={3} numberOfLines={2} flex={1}>
        {total === 1 && (asset.name ?? asset.contractName)}
        {total > 1 &&
          intl.formatMessage(
            {
              id: 'content__str_and_others_int_nfts',
            },
            {
              firstNFT: asset.name ?? asset.contractName,
              otherNFTs: total - 1,
            },
          )}
      </Typography.Body1Strong>
    </Box>
  );
}
function NFTView({ asset, total }: { asset?: INFTAsset; total: number }) {
  if (asset) {
    if (asset.type === NFTAssetType.BTC) {
      return <NFTBTCView asset={asset as NFTBTCAssetModel} />;
    }
    return <NFTEVMView asset={asset as NFTAsset} total={total} />;
  }
  return <Box size="40px" />;
}

export default NFTView;
