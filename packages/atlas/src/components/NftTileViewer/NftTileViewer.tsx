import React from 'react'

import { useNft } from '@/api/hooks'
import { AllNftFieldsFragment } from '@/api/queries'
import { useAsset } from '@/providers/assets'

import { NftTile } from '../NftTile'
import { NftTileDetailsProps } from '../NftTileDetails'

type NftTileViewerProps = {
  nftId?: string
}

export const NftTileViewer: React.FC<NftTileViewerProps> = ({ nftId }) => {
  const { nft, loading } = useNft(nftId || '')
  const thumbnail = useAsset(nft?.video.thumbnailPhoto)

  const getNftProps = (nft?: AllNftFieldsFragment): NftTileDetailsProps => {
    const nftCommponProps = {
      title: nft?.video?.title,
      duration: nft?.video?.duration,
      views: nft?.video?.views,
      loading,
      thumbnail: {
        thumbnailUrl: thumbnail.url,
        loading: thumbnail.isLoadingAsset,
        thumbnailAlt: `${nft?.video?.title} video thumbnail`,
      },
      owner: nft?.ownerMember?.id
        ? {
            name: nft?.ownerMember?.handle,
            assetUrl:
              nft?.ownerMember?.metadata.avatar?.__typename === 'AvatarUri'
                ? nft.ownerMember?.metadata.avatar.avatarUri
                : '',
          }
        : undefined,
      creator: {
        name: nft?.video.channel.ownerMember?.handle,
        assetUrl:
          nft?.video.channel.ownerMember?.metadata.avatar?.__typename === 'AvatarUri'
            ? nft?.video.channel.ownerMember?.metadata.avatar.avatarUri
            : '',
      },
    } as NftTileDetailsProps
    switch (nft?.transactionalStatus.__typename) {
      case 'TransactionalStatusIdle':
      case 'TransactionalStatusInitiatedOfferToMember':
        return {
          ...nftCommponProps,
          auction: 'none',
        }
      case 'TransactionalStatusBuyNow':
        return {
          ...nftCommponProps,
          auction: 'none',
          buyNowPrice: nft.transactionalStatus.price,
        }
      case 'TransactionalStatusAuction':
        return {
          ...nftCommponProps,
          auction: nft.transactionalStatus.auction?.lastBid?.amount ? 'topBid' : 'minBid',
          buyNowPrice: nft.transactionalStatus.auction?.buyNowPrice,
          minBid: nft.transactionalStatus.auction?.startingPrice,
          topBid: nft.transactionalStatus.auction?.lastBid?.amount,
        }
      default:
        return {
          ...nftCommponProps,
          auction: 'none',
        }
    }
  }
  return <NftTile {...getNftProps(nft)} role="viewer" />
}
